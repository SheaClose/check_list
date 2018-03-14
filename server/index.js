const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 3001,
  app = express(),
  session = require('express-session'),
  massive = require('massive'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20').Strategy,
  path = require('path');
require('dotenv').config({
  path: './.env.prod'
});

massive(process.env.CONNECTION_STRING)
  .then(dbInstance => {
    app.set('db', dbInstance);
  })
  .catch(console.log);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/callback',
      scope: 'openid profile'
    },
    (accessToken, refreshToken, profile, cb) => cb(null, profile)
  )
);

app.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const userPhoto = req.user.photos[0].value.split('?')[0];
    const user = {
      id: req.user.id,
      name: req.user.displayName,
      first_name: req.user.name.givenName,
      last_name: req.user.name.familyName,
      img_url: userPhoto
    };
    const db = req.app.get('db');
    db
      .run('select * from checklist_users where id = $1', user.id)
      .then(existingUser => {
        if (!existingUser.length) {
          db
            .run(
              // eslint-disable-next-line
              'insert into checklist_users (id, name, first_name, last_name) values (${id}, ${name}, ${first_name}, ${last_name}); select * from checklist_users where id = ${id}',
              user
            )
            .then(newUser => {
              req.session.user = newUser[0];
              return res.redirect(process.env.FRONT_END_URL || '/');
            })
            .catch(err => console.log('Unable to create new user: ', err));
        } else {
          req.session.user = existingUser[0];
          res.redirect(process.env.FRONT_END_URL || '/');
        }
      })
      .catch(err => console.log('Error retrieving user from database: ', err));
  }
);

// redirects to googleAuth
app.get('/login', passport.authenticate('google'));
// //////////// API'S ////////////////

app.get('/api/user', (req, res) => res.status(200).json(req.session.user));
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json('logged out');
});
app.get('/api/checklists', (req, res) => {
  req.app
    .get('db')
    .checklist_template.find()
    .then(checklists => res.status(200).json(checklists))
    .catch(err => console.log('Unable to fetch checklists: ', err));
});
app.post('/api/newChecklist', (req, res) => {
  const { name: title, desc } = req.body;
  req.app
    .get('db')
    .checklist_template.save({ title, desc, status: 'active' })
    .then(checklist => {
      res.status(200).json(checklist);
    })
    .catch(err => console.log('Unable to create new checklist: ', err));
});
app.delete('/api/checklisttemplate/:id', (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;
  db
    .query(
      'delete from checklist_template where id = $1; select * from checklist_template;',
      id
    )
    .then(checklists => res.status(200).json(checklists))
    .catch(err => res.status(500).json(err));
});
app.get('/api/checklist_item/:id', (req, res) => {
  const db = req.app.get('db');
  db
    .getChecklistItemsByChecklistId(req.params.id)
    .then(checklists => res.status(200).json(checklists))
    .catch(err =>
      console.log('Error getting checklist items by checklist id: ', err)
    );
});
app.post('/api/checklist_item/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const db = req.app.get('db');
  db
    .createNewChecklistItem(name, id, req.session.user.id)
    .then(checklist => res.status(200).json(checklist))
    .catch(err => console.log('Error adding new checklist item: ', err));
});

app.use(express.static(`${__dirname}/../build`));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log('Server listening on port', port);
});

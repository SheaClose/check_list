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
  path: `./.env${process.env.NODE_ENV === 'production' ? '.prod' : ''}`
});

massive(process.env.CONNECTION_STRING)
  .then(dbInstance => {
    app.set('db', dbInstance);
  })
  .catch(err => console.log('Unable to connect to Db: ', err));

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
// app.delete('/api/checklisttemplate/:id', (req, res) => {
//   const db = req.app.get('db');
//   const { id } = req.params;
//   db
//     .query(
//       'delete from checklist_template where id = $1; select * from checklist_template;',
//       id
//     )
//     .then(checklists => res.status(200).json(checklists))
//     .catch(err => res.status(500).json(err));
// });
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
app.put('/api/toggle_checklist_item/:id', (req, res) => {
  const db = req.app.get('db');
  db.checklist_items
    .update({
      id: req.params.id,
      ...req.body.checklist
    })
    .then(() => {
      db
        .getChecklistItemsByChecklistId(req.body.checklistId)
        .then(checklists => res.status(200).json(checklists))
        .catch(err =>
          console.log('Error getting checklist items by checklist id: ', err)
        );
    })
    .catch(err => console.log(`Error updating checklist_items: ${err}`));
});

/////////// New templates ///////////////
app
  .get('/api/checklist_templates', (req, res) => {
    const db = req.app.get('db');
    db.checklist_templates
      .findDoc({ created_by: req.user.id })
      .then(checklists => res.status(200).json(checklists))
      .catch(err => console.log(`Error getting checklist templates: ${err}`));
  })
  .get('/api/checklist_templates/:id', (req, res) => {
    console.log(res);
  })
  .post('/api/checklist_template', (req, res) => {
    const db = req.app.get('db');
    db
      .saveDoc('checklist_templates', {
        ...req.body,
        list_items: [],
        created_by: req.user.id
      })
      .then(template => {
        res.status(200).json(template);
      })
      .catch(err =>
        console.log(`Error creating new checklist_template: ${err}`)
      );
  })
  .delete('/api/checklisttemplate/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    db
      .query('delete from checklist_templates where id = $1;', id)
      .then(() =>
        db.checklist_templates
          .findDoc({ created_by: req.user.id })
          .then(checklists => res.status(200).json(checklists))
          .catch(err =>
            console.log(`Error getting checklist templates: ${err}`)
          )
      )
      .catch(err => res.status(500).json(err));
  });

app.use(express.static(`${__dirname}/../build`));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log('Server listening on port', port);
});

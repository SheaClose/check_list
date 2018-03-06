const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  port = 3001,
  app = express(),
  session = require('express-session'),
  massive = require('massive'),
  passport = require('passport'),
  Auth0Strategy = require('passport-auth0');
require('dotenv').config();

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
app.use('/', express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.DOMAIN,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/callback',
      scope: 'openid profile'
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      console.log('profile: ', profile);
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.get(
  '/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      throw new Error('user null');
    }
    /** This is where we can add user to db, or redirect to the front end */
    res.redirect(process.env.FRONT_END_URL);
  }
);

// redirects to googleAuth
app.get('/login', passport.authenticate('auth0', {}));

// //////////// API'S ////////////////

app.post('/api/postUser', (req, res) => {
  const { user } = req.body;
  const userObj = {
    name: user.name,
    first_name: user.given_name,
    last_name: user.family_name,
    img_url: user.picture,
    id: user.sub
  };
  const db = req.app.get('db');
  db.checklist_users
    .find({ id: userObj.id })
    .then(dbUser => {
      if (!dbUser.length) {
        db.checklist_users.insert(userObj).then(newDbUser => {
          req.session.user = newDbUser;
          return res.status(200).json(req.session.user);
        });
      } else {
        return res.status(200).json(...dbUser);
      }
      return null;
    })
    .catch(err => console.log('cannot find user: ', err));
  //
});

app.get('/api/user', (req, res) => res.status(200).json(req.session.user));

app.listen(port, () => {
  console.log('Server listening on port', port);
});

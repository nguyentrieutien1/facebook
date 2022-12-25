const express = require('express');
const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../src/config/config');
const routes = require('../src/api/v1/routes/authentication');
const app = express();
require('dotenv').config();

// Passport session setup. 
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_key,
    clientSecret:config.facebook_secret ,
    callbackURL: config.callback_url,
    enableProof: true,
    profileFields: ['id', 'displayName', 'email', 'birthday','about','education','gender','hometown','languages','location','accounts']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log(accessToken +"\n", refreshToken+"\n", profile+"\n", done);
      return done(null, profile);
    });
  }
));

app.set('views', __dirname + '/api/v1/interfaces');
app.set('view engine', 'ejs'); // sử dụng view ejs
app.use(cookieParser()); //Parse cookie
app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(session({ secret: 'qưertyuiopasdfghjklzxcvbnmZAQWSXECDFEKLJKJTKLD', key: 'sessionID', cookie:{maxAge:6000}}));  //Save user login
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(3000);
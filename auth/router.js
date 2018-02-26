const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
mongoose.Promise = global.Promise;

const config = require('../config');

const createAuthToken = user => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const { router: authRouter, basicStrategy, jwtStrategy } = require('../auth');
const { User } = require('../users/models');

// 9/25/17 added failWithError to fix dialog box popup when passport sends back 401
// const basicAuth = passport.authenticate('basic', { successRedirect: "/find", failureRedirect: "/auth/login", session: true, failureFlash: true, failWithError: true });
const basicAuth = passport.authenticate('basic', { failWithError: true });
// const basicAuth = passport.authenticate('basic', { session: true });
const jwtAuth = passport.authenticate('jwt', { session: true });

// get login page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Gig Finder | Login',
    nav: true,
    footer: true
  });
});

// get job post page
router.get('/post', authCheck, roleCheck, (req, res) => {
  res.render('post', {
    title: 'Gig Finder | Post',
    nav: true,
    footer: false
  });
});

// get job edit page
router.get('/edit', authCheck, roleCheck, (req, res) => {
  res.render('edit', {
    title: 'Gig Finder | Edit',
    nav: true,
    footer: false
  });
});

// auth check to see if user has been authenticated
// if user has not been authed then redirect to login
function authCheck(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('info_msg', 'You need to log in before you can post a job.');
    res.redirect('login');
  };
};

// role check to see if user is "company"
// if not then redirect to registration
// user needs to be registered as a company in order to post job
function roleCheck(req, res, next) {
  if (req.user.role === "Company") {
    return next();
  }
  else {
    req.flash('info_msg', 'You need to register as a company before you can post or edit a job.');
    res.redirect('../register');
  };
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// login route
router.post('/login', basicAuth, (req, res) => {
  let authToken = createAuthToken(req.user.apiRepr());
  let id = req.user._id;
  res.json({ authToken, id });
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have successfully logged out.');
  res.redirect('login');
});

router.post('/refresh',
  // The user exchanges an existing valid JWT for a new one with a later expiration
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
  }
);

module.exports = { router };
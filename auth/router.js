const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
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

const router = express.Router();
const { router: authRouter, basicStrategy, jwtStrategy } = require('../auth');
const { User } = require('../users/models');

// 9/25/17 added failWithError to fix dialog box popup when passport sends back 401
const basicAuth = passport.authenticate('basic', { session: false, failWithError: true });
const jwtAuth = passport.authenticate('jwt', { session: false });

// protected job post route
router.get('/post', jwtAuth, jsonParser, (req, res) => {
  // res.sendFile(__dirname + '/public/post.html');
  res.sendFile(path.join(__dirname, '../public', 'post.html'))
});

// test login route
// router.post('/login', passport.authenticate('basic', {
//   successRedirect: '/find.html',
//   failureRedirect: '/test'
// }));

// test login route
// router.get('/login', function (req, res, next) {

//   passport.authenticate('basic', function (err, user, info) {
//     console.log(req.user);
//     req.logIn(user, function (err) {

//       // return res.sendFile(path.join(__dirname, '../public', 'find.html'))

//       return next('route')
//     });

//   })(req, res, next);
// });

// -----------------------------------------
// router.post('/login', function (req, res, next) {
//   // console.log(req);
//   passport.authenticate('basic', function (err, user, info) {
//     if (err) { console.log("error1"); return next(err); }
//     if (!user) { console.log("error2"); return res.redirect('/'); }
//     req.logIn(user, function (err) {
//       if (err) { return next(err); }
//       return res.redirect(path.join(__dirname, '../public', 'find.html'));
//     });
//   })(req, res, next);
// });
// -----------------------------------------


// test route
router.post('/login', basicAuth, (req, res) => {
  // console.log(req);
  const authToken = createAuthToken(req.user.apiRepr());
  // console.log(authToken);
  res.json({ authToken });
  // res.sendFile(path.join(__dirname, '../public', 'find.html'));

  // let localStorage;
  // try {
  //   localStorage = window.localStorage;
  // }
  // catch (error) {
  //   console.log("denied.")
  // };
  // localStorage.setItem('authToken', authToken);
  // res.render('find');
});

// test route
// router.post('/login',
//   // The user provides a username and password to login
//   passport.authenticate('basic', { session: false }),
//   (req, res) => {

//     console.log("username: ", req.user.username);
//     res.sendFile(path.join(__dirname, '../public', 'find.html'))
//   }
// );


// router.post('/login',
//   // The user provides a username and password to login
//   passport.authenticate('basic', { session: false }),
//   (req, res) => {

//     console.log("req.user.username", req.user.username);

//     const authToken = createAuthToken(req.user.apiRepr());

//     return User
//       .findById(req.user.id)
//       .then(user => {
//         if (user.apiToken == null) {
//           return User
//             .findByIdAndUpdate(req.user.id, { $set: { apiToken: authToken } })
//             .exec()
//         }
//         res.sendFile(path.join(__dirname, '../public', 'find.html'))
//       })
//   }
// );

router.post('/refresh',
  // The user exchanges an existing valid JWT for a new one with a later
  // expiration
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
  }
);

module.exports = { router };
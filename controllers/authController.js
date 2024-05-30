// controllers/authController.js

const passport = require('passport');
const User = require('../models/user');

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Your validation logic here (if needed)

  const user = new User(username, password);
  // Save user to database or any storage mechanism

  res.send('User registered');
};

exports.login = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/login',
  failureFlash: true // Optional flash messages for failed login
});

exports.logout = (req, res) => {
  req.logout();
  res.send('Logged out');
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Not authenticated');
};

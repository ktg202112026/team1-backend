// controllers/authController.js

const passport = require('passport');
const { supabase } = require('../db'); // Assuming you have a db.js file for Supabase setup

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return res.status(400).send(error.message);
    }
    res.send('User registered');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
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

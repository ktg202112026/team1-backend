// controllers/authController.js
const passport = require('passport');
const supabase = require('../db'); // Import Supabase client

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Use Supabase to create a new user
    const { data, error } = await supabase.auth.signUp({
      email: username,
      password: password
    });

    if (error) {
      return res.status(400).send(error.message);
    }

    res.send('User registered');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/login',
  failureFlash: true
});

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout error');
    }
    res.send('Logged out');
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Not authenticated');
};

//authController.js

const supabase = require('../db');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
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

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password
    });

    if (error) {
      return res.status(400).send(error.message);
    }

    // Save session details or respond with user data
    req.session.user = data.user;
    res.send('Logged in');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout error');
    }
    res.send('Logged out');
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).send('Not authenticated');
};

// Handle Supabase OAuth callback
exports.oauthCallback = async (req, res) => {
  const { provider } = req.params;
  const { code } = req.query;

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code, {
      provider
    });

    if (error) {
      return res.status(400).send(error.message);
    }

    req.session.user = data.user;
    res.redirect('http://52.78.91.27/'); // Redirect to your frontend app
  } catch (err) {
    res.status(500).send('Server error');
  }
};

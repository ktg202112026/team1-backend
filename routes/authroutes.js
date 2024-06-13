const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Supabase OAuth routes
router.get('/auth/github', (req, res) => {
  const redirectTo = supabase.auth.getUrlForProvider('github', {
    redirectTo: 'http://localhost:3000/auth/github/callback' // Your callback URL
  });
  res.redirect(redirectTo);
});

router.get('/auth/google', (req, res) => {
  const redirectTo = supabase.auth.getUrlForProvider('google', {
    redirectTo: 'http://localhost:3000/auth/google/callback' // Your callback URL
  });
  res.redirect(redirectTo);
});

// Supabase OAuth callback routes
router.get('/auth/:provider/callback', authController.oauthCallback);

// Local authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.isAuthenticated, (req, res) => {
  res.send(req.session.user);
});

module.exports = router;

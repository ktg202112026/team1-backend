// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// GitHub authentication route
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/user',
    failureRedirect: '/login'
  })
);

// Google authentication route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/user',
    failureRedirect: '/login'
  })
);

// Existing routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.isAuthenticated, (req, res) => {
  res.send(req.user);
});

module.exports = router;

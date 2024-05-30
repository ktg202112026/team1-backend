// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.isAuthenticated, (req, res) => {
  res.send(req.user);
});

module.exports = router;
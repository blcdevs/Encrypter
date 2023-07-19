const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/auth/post.controllers.js');

// Login
router.post('/login', authController.accountLogin);


module.exports = router;

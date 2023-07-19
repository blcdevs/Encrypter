const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/auth/get.controllers.js');

// Landing
router.get('/', authController.Login);


module.exports = router;

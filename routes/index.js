const express = require('express');
const router = express.Router();

// Authentication
const authenticationRoute = require('./auth/index');
const authenticationPostRoute = require('./auth/indexPost');

router.use('/', authenticationRoute);
router.use('/account/auth', authenticationPostRoute);

// Admin
const adminRoute = require('./admin/index');
const adminPostRoute = require('./admin/indexPost');

router.use('/account', adminRoute);
router.use('/account', adminPostRoute);

module.exports = router;
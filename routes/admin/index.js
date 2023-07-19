const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  authenticationMiddleWare,
  isGrantedPrivilledged,
  isRole,
  isBlockAccess
} = require("./../../middleware/isAuthenticated");
const adminController = require('./../../controllers/admin/get.controllers.js');

// Dashboard
router.get('/dashboard', [authenticationMiddleWare, isGrantedPrivilledged], adminController.Dashboard);

// Profile
router.get('/my-account', [authenticationMiddleWare, isGrantedPrivilledged], adminController.Profile);

// DeviceAudit
router.get('/device-audit', [authenticationMiddleWare, isGrantedPrivilledged], adminController.DeviceAudit);

// LoginAudit
router.get('/log-audit', [authenticationMiddleWare, isGrantedPrivilledged], adminController.LoginAudit);

// PageAudit
router.get('/page-audit', [authenticationMiddleWare, isGrantedPrivilledged], adminController.PageAudit);

// AttemptedDevice
router.get('/attempted-device', [authenticationMiddleWare, isGrantedPrivilledged, isRole], adminController.AttemptedDevice);

// AttemptedUser
router.get('/attempted-user', [authenticationMiddleWare, isGrantedPrivilledged, isRole], adminController.AttemptedUser);

// Users
router.get('/users', [authenticationMiddleWare, isGrantedPrivilledged, isRole], adminController.Users);

// Encryption
router.get('/file-encryption', [authenticationMiddleWare, isGrantedPrivilledged, isBlockAccess], adminController.Encryption);

// Encryption
router.get('/assigned/file-encryption', [authenticationMiddleWare, isGrantedPrivilledged, isBlockAccess], adminController.AssignedEncryption);

// Encryption Decryption
router.get('/file-decryption/:textUniqueID', [authenticationMiddleWare, isGrantedPrivilledged, isBlockAccess], adminController.Decryption);

// Users Access to Encryption
router.get('/file-encryption/users/:textUniqueID', [authenticationMiddleWare, isGrantedPrivilledged, isBlockAccess], adminController.EncryptionUsers);

// Users Encryption
router.get('/users/file-encryption', [authenticationMiddleWare, isGrantedPrivilledged, isRole], adminController.UsersEncryption);

// PASSPORT
passport.serializeUser(function (admin_id, done) {
  done(null, admin_id);
});

passport.deserializeUser(function (admin_id, done) {
  done(null, admin_id);
});

module.exports = router;

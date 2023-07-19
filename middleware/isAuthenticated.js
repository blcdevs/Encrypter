require('dotenv').config();
const helperFunctions = require("./../helpers/HelperFunctions");
const os = require('os')
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

module.exports = {
  authenticationMiddleWare: async (req, res, next) => {
    req.userAttemptedUser = {
      ipAddress: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim(),
      deviceUniqueID: await helperFunctions.randomString(25, "string"),
      browserAgent: req.useragent.source,
      deviceOS: os.platform(),
      routePath: req.originalUrl,
    }
    if (req.isAuthenticated()) {
      req.userAttemptedUser.pageRoute = req.userAttemptedUser.routePath;
      req.userAttemptedUser.uId = req.user.admin_id;
      return next();
    } else {
      await helperFunctions.addAttemptedDevice(req.userAttemptedUser);
      res.redirect('/')
    }
  },

  isGrantedPrivilledged: async (req, res, next) => {
    if (req.user.accountStatus == 0) {
      return next();
    } else {
      req.userAttemptedUser.reason = "Attempt to bypass account deactivation.";
      await helperFunctions.addAttemptedUser(req.userAttemptedUser);
      res.redirect('/logout')
    }
  },

  isRole: async (req, res, next) => {
    if (req.user.role == 1) {
      return next();
    } else {
      req.userAttemptedUser.reason = "User attempt to perform admin action.";
      await helperFunctions.addAttemptedUser(req.userAttemptedUser);
      res.redirect('/logout')
    }
  },

  isBlockAccess: async (req, res, next) => {
    if (req.user.blockAccess != 1) {
      return next();
    } else {
      req.userAttemptedUser.reason = "User attempt to perform priviledge action.";
      await helperFunctions.addAttemptedUser(req.userAttemptedUser);
      res.redirect('/logout')
    }
  },
};

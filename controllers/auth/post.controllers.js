const passport = require('passport');
const os = require('os')
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

module.exports = {
  accountLogin: async (req, res, next) => {
    passport.authenticate('admin', async function (error, admin, info) {
      if (error) { return next(error); }
      if (!admin) { return res.redirect('/'); }
      req.logIn(admin, async function (error) {
        if (error) { return next(error); }
        return res.redirect('/account/dashboard');
      });
    })(req, res, next);
  },

};
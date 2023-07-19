module.exports = {
  Login: async (req, res, next) => {
    res.render('Login', {
      title: 'Login to your Account',
      success: req.flash('success'),
      errors: req.flash('errors'),
      return: req.flash('return')
    });
  },

};
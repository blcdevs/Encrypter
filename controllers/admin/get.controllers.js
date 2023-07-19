const helperFunctions = require("./../../helpers/HelperFunctions");
const helperQuery = require("./../../helpers/HelperQuery");
const models = require('./../../models/index');
const { Op } = require("sequelize");
const AesEncryption = require("./../../helpers/encryptions/aes");
const Sha512Encryption = require("./../../helpers/encryptions/sha512");
const ElgamalEncryption = require("./../../helpers/encryptions/elgamal");

const aesEncryption = new AesEncryption();
const sha512Encryption = new Sha512Encryption();
const elgamalEncryption = new ElgamalEncryption();

module.exports = {
  Dashboard: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Overview Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const total = await Promise.all([
        helperQuery.credQuery("Admin", "count", {}),
        helperQuery.credQuery("TextEncrypt", "count", {})
      ]);
      res.render('admin/Dashboard', {
        title: "Dashboard",
        total,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  Profile: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Profile Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      res.render('admin/Profile', {
        title: "Profile",
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  DeviceAudit: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Device Audit Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const deviceAudit = await helperQuery.credQuery("loginDevices", "findAll", {
        where: { uId: res.locals.admin.id }
      });
      res.render('admin/DeviceAudit', {
        title: "Device Login",
        deviceAudit,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  LoginAudit: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Login Audit Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const loginAudit = await helperQuery.credQuery("AdminLogAudit", "findAll", {
        where: { uId: res.locals.admin.id }
      });
      res.render('admin/LoginAudit', {
        title: "Login Audit",
        loginAudit,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  PageAudit: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Page Audit Route.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const pageAudit = await helperQuery.credQuery("AdminPageAudit", "findAll", {
        where: { uId: res.locals.admin.id }
      });
      res.render('admin/PageAudit', {
        title: "Page Audit",
        pageAudit,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  AttemptedDevice: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Attempted Device Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const attemptedDevice = await helperQuery.credQuery("AttemptedDevice", "findAll", {});
      res.render('admin/AttemptedDevice', {
        title: "Attempted Device",
        attemptedDevice,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  AttemptedUser: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Attempted User Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const attemptedUser = await helperQuery.credQuery("AttemptedUser", "findAll", {});
      res.render('admin/AttemptedUser', {
        title: "Attempted Users",
        attemptedUser,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  Users: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Users Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const usersData = await helperQuery.credQuery("Admin", "findAll", {
        where: {
          id: {
            [Op.ne]: res.locals.admin.id,
          }
        }
      });
      res.render('admin/Users', {
        title: "Users",
        usersData,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  UsersEncryption: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Users Encryption Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const encryption = await helperQuery.credQuery("TextEncrypt", "findAll", {
        where: {
          uId: {
            [Op.ne]: res.locals.admin.id,
          }
        },
        include: [
          {
            model: models.FileAccess,
            as: 'FileAccess',
            separate: true,
          },
          {
            model: models.Admin,
            as: 'Admin'
          },
        ], order: [['id', 'DESC']]
      });
      res.render('admin/UsersEncryption', {
        title: "Users Encryption",
        encryption,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success')
      });
    } catch (error) {
      console.log(error)
    }
  },
  Encryption: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Encryption Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const encryption = await helperQuery.credQuery("TextEncrypt", "findAll", {
        where: { uId: res.locals.admin.id },
        include: [
          {
            model: models.FileAccess,
            as: 'FileAccess',
            separate: true,
          },
        ], order: [['id', 'DESC']]
      });
      res.render('admin/Encryption', {
        title: "Encryption",
        encryption,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success'),
        encryptionrecord: req.flash('encryptionrecord'),
        decryptionrecord: req.flash('decryptionrecord')
      });
    } catch (error) {
      console.log(error)
    }
  },
  AssignedEncryption: async (req, res, next) => {
    try {
      req.userAttemptedUser.actionPerformed = "Navigated to Encryption Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      const encryption = await helperQuery.credQuery("FileAccess", "findAll", {
        where: { adminId: res.locals.admin.id },
        include: [
          {
            model: models.TextEncrypt,
            as: 'TextEncrypt',
            include: [
              {
                model: models.Admin,
                as: 'Admin',
              },
            ], order: [['id', 'DESC']]
          },
        ], order: [['id', 'DESC']]
      });
      res.render('admin/UsersEncryptionAccess', {
        title: "Assigned Encryption",
        encryption,
        errors: req.flash('errors'),
        return: req.flash('return'),
        success: req.flash('success'),
        encryptionrecord: req.flash('encryptionrecord'),
        decryptionrecord: req.flash('decryptionrecord')
      });
    } catch (error) {
      console.log(error)
    }
  },
  Decryption: async (req, res, next) => {
    try {
      let data;
      req.checkParams('textUniqueID', 'Invalid Encryption Info.').trim().escape().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect('/account/file-encryption');
      }
      req.userAttemptedUser.actionPerformed = "Revealed Encrypted data.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);

      if (res.locals.admin.role == 1) {
        data = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: {
            textUniqueID: req.params.textUniqueID
          }
        });
      } else {
        data = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: {
            [Op.and]: [
              { uId: res.locals.admin.id },
              { textUniqueID: req.params.textUniqueID }
            ]
          }
        });
      }
      if (data != null) {
        const decryptaes = await aesEncryption.decryptData(data.algo2);
        req.flash('decryptionrecord',
          {
            data: decryptaes,
            fileType: data.fileType
          })
        if (data.fileType == 1) {
          res.redirect('/account/file-encryption')
        } else {
          return res.download(`${__dirname}/../../public/files/${decryptaes}`)
        }
      } else {
        req.flash('error', "Unknown Data!")
        res.redirect('/account/file-encryption')
      }
    } catch (error) {
      console.log(error)
    }
  },
  EncryptionUsers: async (req, res, next) => {
    try {
      req.checkParams('textUniqueID', 'Invalid Encryption Info.').trim().escape().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect('/account/file-encryption');
      }
      let encryptionUsers;
      req.userAttemptedUser.actionPerformed = "Navigated to Encryption Users Page.";
      await helperFunctions.addPageAudit(req.userAttemptedUser);
      if (res.locals.admin.role == 1) {
        encryptionUsers = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: { textUniqueID: req.params.textUniqueID },
          include: [
            {
              model: models.FileAccess,
              as: 'FileAccess',
              separate: true,
              include: [
                {
                  model: models.Admin,
                  as: 'Admin',
                },
              ], order: [['id', 'DESC']]
            },
          ], order: [['id', 'DESC']]
        });
      } else {
        encryptionUsers = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: {
            [Op.and]: [
              { uId: res.locals.admin.id },
              { textUniqueID: req.params.textUniqueID }
            ]
          },
          include: [
            {
              model: models.FileAccess,
              as: 'FileAccess',
              separate: true,
              include: [
                {
                  model: models.Admin,
                  as: 'Admin',
                },
              ], order: [['id', 'DESC']]
            },
          ], order: [['id', 'DESC']]
        });
      }
      if (encryptionUsers != null) {
        const Users = await helperQuery.credQuery("Admin", "findAll", {
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.ne]: res.locals.admin.id,
                }
              },
              {
                role: {
                  [Op.ne]: 1,
                }
              }
            ]
          }
        });
        res.render('admin/EncryptionUsers', {
          title: "File User Access",
          encryptionUsers,
          Users,
          errors: req.flash('errors'),
          return: req.flash('return'),
          success: req.flash('success')
        });
      } else {
        req.flash('error', "Unknown Data!")
        res.redirect('/account/dashboard')
      }
    } catch (error) {
      console.log(error)
    }
  },

};
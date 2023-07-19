const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const helperFunctions = require("./../../helpers/HelperFunctions");
const helperQuery = require("./../../helpers/HelperQuery");
const models = require('./../../models/index');
const { Op } = require("sequelize");
const { unlinkSync } = require("fs");

const AesEncryption = require("./../../helpers/encryptions/aes");
const Sha512Encryption = require("./../../helpers/encryptions/sha512");
const ElgamalEncryption = require("./../../helpers/encryptions/elgamal");

const aesEncryption = new AesEncryption();
const sha512Encryption = new Sha512Encryption();
const elgamalEncryption = new ElgamalEncryption();

module.exports = {
  Logout: async (req, res, next) => {
    req.userAttemptedUser.actionPerformed = "Logged out of account.";
    await helperFunctions.addPageAudit(req.userAttemptedUser);

    req.logout();
    req.session.destroy();
    res.redirect('/');
  },

  updateProfile: async (req, res, next) => {
    try {
      const currentHashedPassword = res.locals.admin.password.toString();
      const currentUnHashedPassword = await bcryptjs.compare(req.body.old_password, currentHashedPassword)
      req.checkBody('old_password', 'Invalid Password.').notEmpty().exists().trim().escape();
      req.checkBody('password', 'Password must be between 8-100 characters long').len(6, 100);
      req.checkBody('password', 'Old Password cannot be same as new').notEmpty().exists().trim().escape().custom(value => {
        if (req.body.old_password != value) {
          return Promise.reject('Old Password cannot be same as new');
        }
      });
      req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password).notEmpty().exists().trim().escape();

      const errors = req.validationErrors();
      if (errors) {
        req.userAttemptedUser.actionPerformed = "Attempted to update profile password: Some Errors occurred.";
        await helperFunctions.addPageAudit(req.userAttemptedUser);
        req.flash('errors', errors)
        res.redirect('/account/my-account');
      }
      if (!currentUnHashedPassword) {
        req.userAttemptedUser.actionPerformed = "Attempted to update profile password: Invalid Password.";
        await helperFunctions.addPageAudit(req.userAttemptedUser);
        req.flash('return', "Invalid Password.")
        res.redirect('/account/my-account');
      }
      req.userAttemptedUser.actionPerformed = "Updated Profile Password.";
      await Promise.all([
        helperQuery.updateQuery("Admin", "update",
          { password: bcryptjs.hashSync(req.body.password, saltRounds) },
          {
            where: { id: res.locals.admin.id }
          }
        ),
        helperFunctions.addPageAudit(req.userAttemptedUser)
      ]);

      req.flash('success', req.userAttemptedUser.actionPerformed)
      res.redirect('/account/my-account');
    } catch (error) {
      console.log(error)
    }
  },

  addUser: async (req, res, next) => {
    try {
      req.checkBody('fullName', 'Fullname cannot be empty.').notEmpty().exists().trim().escape();
      req.checkBody('email', 'Invalid Credentials').isEmail().normalizeEmail().notEmpty();
      req.checkBody('email', 'Invalid Email').len(4, 100);
      req.checkBody('password', 'Password must be between 6-100 characters long.').len(6, 100).notEmpty().exists().trim().escape();
      req.checkBody('confirm_password', 'Passwords do not match.').equals(req.body.password).notEmpty().exists().trim().escape();
      req.checkBody('role', 'Invalid Account Role.').notEmpty().exists().trim().escape();
      const errors = req.validationErrors();
      if (errors) {
        req.userAttemptedUser.actionPerformed = `Attempted to add user account ${req.body.fullName}: Some Errors occurred.`;
        await helperFunctions.addPageAudit(req.userAttemptedUser);
        req.flash('errors', errors)
        return res.redirect('/account/users');
      }
      const users = {
        fullName: req.body.fullName,
        email: req.body.email.toLowerCase(),
        password: bcryptjs.hashSync(req.body.password, saltRounds),
        role: req.body.role,
        position: req.body.role == 1 ? "Admin" : "User",
        accountStatus: 0,
        blockAccess: 0,
      }

      const checkUserEmail = await helperQuery.credQuery("Admin", "findOne", {
        where: { email: users.email }
      });
      if (checkUserEmail != null) {//email check
        req.userAttemptedUser.actionPerformed = `Attempted to add user account ${users.fullName}: Email Address already exist.`;
        await helperFunctions.addPageAudit(req.userAttemptedUser);
        req.flash('return', "Email Address already exist")
        res.redirect('/account/users');
      }
      req.userAttemptedUser.actionPerformed = `User account (${users.fullName}) creation successful.`;
      await Promise.all([
        helperQuery.credQuery("Admin", "create", users),
        helperFunctions.addPageAudit(req.userAttemptedUser)
      ]);

      req.flash('success', req.userAttemptedUser.actionPerformed)
      res.redirect('/account/users');
    } catch (error) {
      console.log(error)
    }
  },
  updateUser: async (req, res, next) => {
    try {
      req.checkBody('fullName', 'Invalid user fullname').trim().escape();
      req.checkBody('role', 'Invalid user role.').trim().escape();
      req.checkBody('accoutStatus', 'Invalid user account status.').trim().escape();
      req.checkBody('blockAccess', 'State field cannot be empty.').trim().escape();
      req.checkParams('userID', 'Invalid User Info.').trim().escape().isInt().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        res.redirect('/account/users');
      }
      const users = {
        role: req.body.role,
        position: req.body.role == 1 ? "Admin" : "User",
        accountStatus: req.body.accountStatus,
        blockAccess: req.body.blockAccess,
      }
      req.userAttemptedUser.actionPerformed = `User account ${req.body.fullName} updated successfully.`;
      await Promise.all([
        helperQuery.updateQuery("Admin", "update",
          users,
          {
            where: { id: req.params.userID }
          }
        ),
        helperFunctions.addPageAudit(req.userAttemptedUser)
      ]);

      req.flash('success', req.userAttemptedUser.actionPerformed)
      return res.redirect('/account/users');
    } catch (error) {
      console.log(error)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      req.checkParams('userID', 'Invalid User Info.').trim().escape().isInt().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        res.redirect('/account/users');
      }
      req.userAttemptedUser.actionPerformed = `User account deleted successfully.`;
      await Promise.all([
        helperQuery.credQuery("Admin", "destroy", {
          where: { id: req.params.userID }
        }),
        helperFunctions.addPageAudit(req.userAttemptedUser)
      ]);

      req.flash('success', req.userAttemptedUser.actionPerformed)
      return res.redirect('/account/users');
    } catch (error) {
      console.log(error)
    }
  },
  addEncryption: async (req, res, next) => {
    try {
      if (req.body.fileType) {
        if (['2', '3'].includes(req.body.fileType)) {
          req.checkBody('fileType', 'File Type must be integer.').isInt();
        }
      } else {
        req.checkBody('encryptTextData', 'Text to encrypt cannot be empty.').trim().escape().notEmpty();
      }

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect('/account/file-encryption');
      }

      if (req.body.fileType) {
        if (['2', '3'].includes(req.body.fileType)) {
          const file = req.file;
          const fileName = file.filename;
          if (!["application/pdf", "application/msword", "video/mp4", "audio/mp3", "image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
            unlinkSync(file.path)
            req.flash('error', "The uploaded file format is not allowed please upload an appropriate file!")
            return res.redirect('/account/file-encryption');
          }
          req.body.encryptTextData = `${fileName}`;
        }
      }
      req.userAttemptedUser.actionPerformed = `File encryption successful.`;
      const elgamal = await elgamalEncryption.encryptData(req.body.encryptTextData);
      const aes = await aesEncryption.encryptData(req.body.encryptTextData);
      const sha512 = await sha512Encryption.encryptData(req.body.encryptTextData);

      const aesMasked = await aesEncryption.encryptData(JSON.stringify(elgamal.hashed));
      const masked = await sha512Encryption.encryptData(aesMasked.content);

      const algorithms = {
        textUniqueID: await helperFunctions.randomString(15, "string"),
        uId: res.locals.admin.id,
        fileType: req.body.fileType !== undefined ?
          req.body.fileType <= 3 ? req.body.fileType : 1
          : 1,
        algo1: elgamal,
        key1: elgamal.hashed,
        algo2: aes,
        key2: aes.content,
        algo3: sha512,
        masked,
      }
      await Promise.all([
        helperQuery.credQuery("TextEncrypt", "create", algorithms),
        helperFunctions.addPageAudit(req.userAttemptedUser)
      ]);
      req.flash('success', req.userAttemptedUser.actionPerformed)
      req.flash('encryptionrecord', {
        data: req.body.encryptTextData,
        fileType: req.body.fileType !== undefined ?
          req.body.fileType <= 3 ? req.body.fileType : 1
          : 1,
        elgamal: elgamal.hashed,
        aes: aes.content,
        sha512,
        masked
      })
      return res.redirect('/account/file-encryption');
    } catch (error) {
      console.log(error)
    }
  },
  deleteEncryption: async (req, res, next) => {
    try {
      let data, decryptaes;
      req.checkParams('textUniqueID', 'Invalid Encryption Info.').trim().escape().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect('/account/file-encryption');
      }
      req.userAttemptedUser.actionPerformed = `File deleted successfully.`;

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
        if (data.fileType != 1) {
          decryptaes = await aesEncryption.decryptData(data.algo2);
        }
        await Promise.all([
          helperQuery.credQuery("TextEncrypt", "destroy", {
            where: { textUniqueID: req.params.textUniqueID }
          }),
          helperFunctions.addPageAudit(req.userAttemptedUser)
        ]);
        if (data.fileType != 1) {
          unlinkSync(`${__dirname}/../../public/files/${decryptaes}`)
        }

        req.flash('success', req.userAttemptedUser.actionPerformed)
        return res.redirect('/account/file-encryption');
      } else {
        req.flash('error', "Unknown Data!")
        res.redirect('/account/file-encryption')
      }
    } catch (error) {
      console.log(error)
    }
  },
  blockOrAllowDevice: async (req, res, next) => {
    try {
      const status = req.params.status;
      req.checkParams('deviceUniqueID', 'Invalid User Info.').trim().escape().notEmpty();
      req.checkParams('status', 'Status cannot be empty.').notEmpty().exists().trim().escape();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect('/account/device-audit');
      }
      req.userAttemptedUser.actionPerformed = `Device ${status == 1 ? "Unban" : "Banned"} successfully.`;
      await Promise.all([
        helperQuery.updateQuery("loginDevices", "update",
          { status },
          {
            where: { deviceUniqueID: req.params.deviceUniqueID }
          }
        ),
        helperFunctions.addPageAudit(req.userAttemptedUser)
      ]);
      req.flash('success', req.userAttemptedUser.actionPerformed)
      return res.redirect('/account/device-audit');
    } catch (error) {
      console.log(error)
    }
  },
  grantUserFileAccess: async (req, res, next) => {
    try {
      let checkIfUserHasAccess;
      const textUniqueID = req.params.textUniqueID, adminId = req.body.adminId;
      req.checkParams('textUniqueID', 'Invalid User Info.').trim().escape().notEmpty();
      req.checkBody('adminId', 'Invalid User Info.').trim().escape().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect('/account/file-encryption');
      }
      if (res.locals.admin.role != 1) {
        checkIfUserHasAccess = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: {
            [Op.and]: [
              { textUniqueID },
              { uId: res.locals.admin.id }
            ]
          }
        });
      } else {
        checkIfUserHasAccess = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: { textUniqueID }
        });
      }
      if (!checkIfUserHasAccess) {
        req.flash('return', "User is not verified to perform this operation.")
        res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      }
      const checkIfEligible = await helperQuery.credQuery("FileAccess", "findOne", {
        where: {
          [Op.and]: [
            { textId: checkIfUserHasAccess.id },
            { adminId }
          ]
        }
      });
      req.userAttemptedUser.actionPerformed = `User granted file access successfully.`;
      if (checkIfEligible) {
        await helperFunctions.addPageAudit(req.userAttemptedUser)
        req.flash('return', "User already have access.")
        res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      } else {
        const user = await helperQuery.credQuery("Admin", "findOne", {
          where: { id: adminId }
        });
        if (!user) {
          req.flash('return', "User does not exist.")
          res.redirect(`/account/file-encryption/users/${textUniqueID}`);
        }
        const userInfo = {
          textId: checkIfUserHasAccess.id,
          adminId
        };
        await Promise.all([
          helperQuery.credQuery("FileAccess", "create", userInfo),
          helperFunctions.addPageAudit(req.userAttemptedUser)
        ]);
        req.flash('success', req.userAttemptedUser.actionPerformed)
        return res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      }
    } catch (error) {
      console.log(error)
    }
  },
  denyUserFileAccess: async (req, res, next) => {
    try {
      let checkIfUserHasAccess;
      const textUniqueID = req.params.textUniqueID, adminId = req.params.userID;
      req.checkParams('userID', 'Invalid User Info.').trim().escape().isInt().notEmpty();
      req.checkParams('textUniqueID', 'Invalid User Info.').trim().escape().notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        req.flash('errors', errors)
        return res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      }
      if (res.locals.admin.role != 1) {
        checkIfUserHasAccess = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: {
            [Op.and]: [
              { textUniqueID },
              { uId: res.locals.admin.id }
            ]
          }
        });
      } else {
        checkIfUserHasAccess = await helperQuery.credQuery("TextEncrypt", "findOne", {
          where: { textUniqueID }
        });
      }
      if (!checkIfUserHasAccess) {
        req.flash('return', "User is not verified to perform this operation.")
        res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      }
      const checkIfEligible = await helperQuery.credQuery("FileAccess", "findOne", {
        where: {
          [Op.and]: [
            { textId: checkIfUserHasAccess.id },
            { adminId }
          ]
        }
      });
      req.userAttemptedUser.actionPerformed = `User access revoked successfully.`;
      if (!checkIfEligible) {
        await helperFunctions.addPageAudit(req.userAttemptedUser)
        req.flash('return', "User does not have access.")
        res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      } else {
        await Promise.all([
          helperQuery.credQuery("FileAccess", "destroy", {
            where: {
              [Op.and]: [
                { textId: checkIfUserHasAccess.id },
                { adminId }
              ]
            }
          }),
          helperFunctions.addPageAudit(req.userAttemptedUser)
        ]);
        req.flash('success', req.userAttemptedUser.actionPerformed)
        return res.redirect(`/account/file-encryption/users/${textUniqueID}`);
      }
    } catch (error) {
      console.log(error)
    }
  },

};
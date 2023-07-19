'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Admin.hasMany(models.loginDevices, { as: 'loginDevices', foreignKey: 'uId' }); // loginDevices
      models.Admin.hasMany(models.AdminLogAudit, { as: 'AdminLogAudit', foreignKey: 'uId' }); // AdminLogAudit
      models.Admin.hasMany(models.AdminPageAudit, { as: 'AdminPageAudit', foreignKey: 'uId' }); // AdminPageAudit
      models.Admin.hasMany(models.TextEncrypt, { as: 'TextEncrypt', foreignKey: 'uId' }); // TextEncrypt
      models.Admin.hasMany(models.FileAccess, { as: 'FileAccess', foreignKey: 'adminId' }); // FileAccess
      models.Admin.hasMany(models.AttemptedUser, { as: 'AttemptedUser', foreignKey: 'uId' }); // AttemptedUser
    }
  };
  Admin.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    position: DataTypes.STRING,
    role: DataTypes.INTEGER,
    password: DataTypes.STRING,
    accountStatus: DataTypes.INTEGER,
    blockAccess: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};
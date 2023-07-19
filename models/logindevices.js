'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loginDevices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.loginDevices.belongsTo(models.Admin, { as: 'Admin', foreignKey: 'uId', onDelete: 'CASCADE' }); //Admin
    }
  };
  loginDevices.init({
    uId: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    deviceUniqueID: DataTypes.STRING,
    browserAgent: DataTypes.STRING,
    deviceOS: DataTypes.STRING,
    status: DataTypes.INTEGER,
    lastLogin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'loginDevices',
  });
  return loginDevices;
};
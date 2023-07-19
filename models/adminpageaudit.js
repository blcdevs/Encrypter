'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminPageAudit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.AdminPageAudit.belongsTo(models.Admin, { as: 'Admin', foreignKey: 'uId', onDelete: 'CASCADE' } ); // Admin
    }
  };
  AdminPageAudit.init({
    uId: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    browserAgent: DataTypes.STRING,
    pageRoute: DataTypes.STRING,
    actionPerformed: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AdminPageAudit',
  });
  return AdminPageAudit;
};
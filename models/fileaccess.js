'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FileAccess extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.FileAccess.belongsTo(models.Admin, { as: 'Admin', foreignKey: 'adminId', onDelete: 'CASCADE' }); // Admin
            models.FileAccess.belongsTo(models.TextEncrypt, { as: 'TextEncrypt', foreignKey: 'textId', onDelete: 'CASCADE' }); // TextEncrypt
        }
    };
    FileAccess.init({
        textId: DataTypes.INTEGER,
        adminId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'FileAccess',
    });
    return FileAccess;
};
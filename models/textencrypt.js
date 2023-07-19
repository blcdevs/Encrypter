'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TextEncrypt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.TextEncrypt.hasMany(models.FileAccess, { as: 'FileAccess', foreignKey: 'textId' }); // FileAccess
            models.TextEncrypt.belongsTo(models.Admin, { as: 'Admin', foreignKey: 'uId', onDelete: 'CASCADE' }); // Admin
        }
    };
    TextEncrypt.init({
        textUniqueID: DataTypes.STRING,
        uId: DataTypes.INTEGER,
        fileType: {
            type: DataTypes.INTEGER, // 1 == Text, 2 == Audio, 3 == Video
            defaultValue: 1,
        },
        algo1: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('algo1'));
            },
            set: function (val) {
                return this.setDataValue('algo1', JSON.stringify(val));
            }
        },
        key1: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('key1'));
            },
            set: function (val) {
                return this.setDataValue('key1', JSON.stringify(val));
            }
        },
        algo2: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('algo2'));
            },
            set: function (val) {
                return this.setDataValue('algo2', JSON.stringify(val));
            }
        },
        key2: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('key2'));
            },
            set: function (val) {
                return this.setDataValue('key2', JSON.stringify(val));
            }
        },
        algo3: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('algo3'));
            },
            set: function (val) {
                return this.setDataValue('algo3', JSON.stringify(val));
            }
        },
        masked: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('masked'));
            },
            set: function (val) {
                return this.setDataValue('masked', JSON.stringify(val));
            }
        },
    }, {
        sequelize,
        modelName: 'TextEncrypt',
    });
    return TextEncrypt;
};
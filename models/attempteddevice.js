'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AttemptedDevice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    AttemptedDevice.init({
        ipAddress: DataTypes.STRING,
        deviceUniqueID: DataTypes.STRING,
        browserAgent: DataTypes.STRING,
        deviceOS: DataTypes.STRING,
        routePath: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'AttemptedDevice',
    });
    return AttemptedDevice;
};
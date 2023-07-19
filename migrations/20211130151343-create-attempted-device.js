'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AttemptedDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ipAddress: {
        type: Sequelize.STRING
      },
      deviceUniqueID: {
        type: Sequelize.STRING
      },
      browserAgent: {
        type: Sequelize.STRING
      },
      deviceOS: {
        type: Sequelize.STRING
      },
      routePath: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AttemptedDevices');
  }
};
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loginDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Admins',
          key: 'id',
          as: 'uId',
        },
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
      status: {
        type: Sequelize.INTEGER
      },
      lastLogin: {
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
    await queryInterface.dropTable('loginDevices');
  }
};
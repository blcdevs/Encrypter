'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AttemptedUsers', {
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
      reason: {
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
    await queryInterface.dropTable('AttemptedUsers');
  }
};
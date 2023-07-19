'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TextEncrypts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      textUniqueID: {
        type: Sequelize.STRING
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
      algo1: {
        type: Sequelize.TEXT
      },
      key1: {
        type: Sequelize.TEXT
      },
      algo2: {
        type: Sequelize.TEXT
      },
      key2: {
        type: Sequelize.TEXT
      },
      algo3: {
        type: Sequelize.TEXT
      },
      masked: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('TextEncrypts');
  }
};
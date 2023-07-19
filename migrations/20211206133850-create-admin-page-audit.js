'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AdminPageAudits', {
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
      browserAgent: {
        type: Sequelize.STRING
      },
      pageRoute: {
        type: Sequelize.STRING
      },
      actionPerformed: {
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
    await queryInterface.dropTable('AdminPageAudits');
  }
};
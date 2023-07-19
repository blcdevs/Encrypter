'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'TextEncrypts',
      'type',
      {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        after: "uId",
        // before: "algo1",
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TextEncrypts', 'type');
  }
}
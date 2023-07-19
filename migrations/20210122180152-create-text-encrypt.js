'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('TextEncrypts', 'type', 'fileType');

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('TextEncrypts', 'fileType', 'type');
  }
}
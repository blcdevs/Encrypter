'use strict';
require("dotenv").config();
const faker = require('faker');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const role = [1, 0];
const position = ['Admin', 'User'];

function randomPick(x) {
  return x[Math.floor(Math.random() * x.length)];
}
let admins = [];

admins = [...Array(20)].map((user) => ({
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  position: "User",
  role: 0,
  password: bcryptjs.hashSync(process.env.MY_PASSWORD),
  accountStatus: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}))

admins.push({
  fullName: "Deborah",
  email: "debarah@encryptor.io",
  position: "Admin",
  role: 1,
  password: bcryptjs.hashSync(process.env.MY_PASSWORD),
  accountStatus: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Admins', admins, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Admins', null, {});
  }
};

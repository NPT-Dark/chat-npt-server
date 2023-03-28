'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      avatar:{
        allowNull:true,
        type: Sequelize.STRING
      },
      firstName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      userName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      passWord: {
        allowNull:false,
        type: Sequelize.STRING
      },
      gender: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      age:{
        allowNull:false,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull:false,
        type: Sequelize.STRING
      },
      status:{
        allowNull:false,
        type: Sequelize.INTEGER
      },
      token:{
        allowNull:false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
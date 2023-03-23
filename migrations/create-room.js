'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id_Room: {
        allowNull: false,
        primaryKey: true,
        type:Sequelize.UUID
      },
      id_User: {
          allowNull: false,
          type:Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type:Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};
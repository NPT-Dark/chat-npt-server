'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FriendRqs', {
      id_FriendRq: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      id_User_Send: {
          allowNull: false,
          type: Sequelize.UUID
      },
      id_User_Recieve: {
          allowNull: false,
          type: Sequelize.UUID
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
    await queryInterface.dropTable('FriendRqs');
  }
};
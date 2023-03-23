'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id_Message: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      id_Room: {
          allowNull: false,
          type: Sequelize.UUID
        },
      id_User_Send: {
          allowNull: false,
          type: Sequelize.UUID
      },
      id_User_Receive: {
          allowNull: false,
          type: Sequelize.UUID
      },
      Message: {
          allowNull: false,
          type: Sequelize.STRING
      },
      Seen: {
          allowNull: false,
          type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Messages');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id_Notification: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      id_User: {
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
    await queryInterface.dropTable('Notifications');
  }
};
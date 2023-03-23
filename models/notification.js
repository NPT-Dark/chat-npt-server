'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    id_Notification: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    id_User: {
      allowNull: false,
      type: DataTypes.UUID
    },
    Message: {
        allowNull: false,
        type: DataTypes.STRING
    },
    Seen: {
        allowNull: false,
        type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};
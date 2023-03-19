'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    avatar:{
      allowNull:true,
      type: DataTypes.STRING
    },
    firstName: {
      allowNull:false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull:false,
      type: DataTypes.STRING
    },
    userName: {
      allowNull:false,
      type: DataTypes.STRING
    },
    passWord: {
      allowNull:false,
      type: DataTypes.STRING
    },
    gender: {
      allowNull:false,
      type: DataTypes.INTEGER
    },
    age:{
      allowNull:false,
      type: DataTypes.INTEGER
    },
    email: {
      allowNull:false,
      type: DataTypes.STRING
    },
    token:{
      allowNull:false,
      type: DataTypes.STRING
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
    modelName: 'User',
  });
  return User;
};
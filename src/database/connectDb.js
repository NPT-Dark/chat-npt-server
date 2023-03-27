const { Sequelize } = require("sequelize");
const ConnectDB = async () => {
  const sequelize = new Sequelize(process.env.DATABASE,process.env.USERNAME_DB,process.env.PASSWORD_DB, {
    host: process.env.HOST_DB,
    dialect: "postgres",
    logging: false
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  });
  try {
    await sequelize.authenticate();
    console.log("Connect database successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = ConnectDB;

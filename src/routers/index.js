const express = require("express");
const { SignUp,SignIn, UpdateUser } = require("../controllers/userControl");
const routers = express.Router();
//route
routers.post("/user/signup", SignUp);
routers.post("/user/signin", SignIn);
routers.put("/user/update", UpdateUser);

module.exports = routers;

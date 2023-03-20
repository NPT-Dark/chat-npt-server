const express = require("express");
const { SignUp,SignIn, UpdateUser, cookieJwtAuth, GetUser } = require("../controllers/userControl");
const routers = express.Router();
//route
routers.post("/user/signup", SignUp);
routers.post("/user/signin", SignIn);
routers.post("/user/getuser",cookieJwtAuth,GetUser);
routers.put("/user/update",cookieJwtAuth, UpdateUser);

module.exports = routers;

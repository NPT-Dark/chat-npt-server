const express = require("express");
const { SignUp,SignIn, UpdateUser, cookieJwtAuth, GetUser, GetUserAddFriend } = require("../controllers/userControl");
const routers = express.Router();
//route
routers.post("/user/signup", SignUp);
routers.post("/user/signin", SignIn);
routers.post("/user/getuser",GetUser);
routers.post("/user/finduser",GetUserAddFriend);
routers.put("/user/update", UpdateUser);

module.exports = routers;

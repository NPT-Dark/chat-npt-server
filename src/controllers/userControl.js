const Db = require("../../models");
const { createUserDTO } = require("../models/userDTO");
const { ComparePassword, HashPassword } = require("../services/secret");
const { FindUser } = require("../services/userService");
const { ValidateLength, ValidateEmail } = require("../services/validate");
const SignUp = async (req, res) => {
  const newUser = await createUserDTO(req.body);
  if(ValidateLength(req.body.password.length,null,6) && ValidateLength(req.body.username.length,null,6) && ValidateLength(req.body.gender,null,0) && ValidateLength(req.body.age,null,10) && ValidateEmail(req.body.email))
  {
    try {
      await Db.User.create(newUser);
    } catch (err) {
      return res.status(500).json(err.message);
    }
    return res.status(200).json(newUser);
  }
  else{
    return res.status(500).json("Please check validate fields !");
  }
};
const SignIn = async (req, res) => {
  if (req.body.token) {
    try {
      const findUser = await FindUser({
        token: req.body.token,
      });
      if (findUser) {
        return res.status(200).json(findUser);
      }
      return res.status(200).json("Username could not be found !");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
  else{
    try {
      const findUser = await FindUser({
        userName: req.body.username,
      });
      if (findUser) {
        const checkPass = await ComparePassword(
          req.body.password,
          findUser.passWord
        );
        if (checkPass) {
            return res.status(200).json(findUser);
        } 
        return res.status(500).json("Password is incorrect !");
      }
      return res.status(500).json("Username could not be found !");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
};
const UpdateUser = async (req, res) => {
  if (req.body.password) {
    try {
      const findUser = await FindUser({
        userName: req.body.username,
      });
      if (findUser) {
        const checkPass = await ComparePassword(
          req.body.password,
          findUser.passWord
        );
        if (checkPass) {
          try {
            if(ValidateLength(req.body.newPassword.length,null,6))
            {
              await Db.User.update(
                {
                  passWord: await HashPassword(req.body.newPassword),
                  updateAt: new Date().getTime(),
                },
                {
                  where: {
                    id: findUser.id,
                  },
                }
              );
              return res.status(200).json("Update successfully !!");
            }
            return res.status(500).json("Password must be more than 6 characters !");
          } catch (err) {
            return res.status(500).json(err.message);
          }
        }
        return res.status(500).json("Password does not match !");
      }
      return res.status(500).json("User could not be found !");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
  if (req.body.avatar) {
  }
};
module.exports = { SignUp, SignIn, UpdateUser };

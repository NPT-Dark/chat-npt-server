const Db = require("../../models");
const { createUserDTO } = require("../models/userDTO");
const { ComparePassword, HashPassword } = require("../services/secret");
const { FindUser } = require("../services/userService");
const { ValidateLength, ValidateEmail } = require("../services/validate");
const JWT = require("jsonwebtoken");
//SignUp
const SignUp = async (req, res) => {
  const newUser = await createUserDTO(req.body);
  if (
    ValidateLength(req.body.password.length, null, 6) &&
    ValidateLength(req.body.username.length, null, 6) &&
    ValidateLength(req.body.gender, null, 0) &&
    ValidateLength(req.body.age, null, 10) &&
    ValidateEmail(req.body.email)
  ) {
    const findUser = await FindUser({
      userName: req.body.username,
    });
    if (findUser) {
      res.status(500).json("User already exists !");
    } else {
      try {
        await Db.User.create(newUser);
      } catch (err) {
        return res.status(500).json(err.message);
      }
      return res.status(200).json(newUser);
    }
  } else {
    return res.status(500).json("Please check validate fields !");
  }
};
//SignIn
const SignIn = async (req, res) => {
  if (req.body.token) {
    try {
      const findUser = await FindUser({
        token: req.body.token,
      });
      if (findUser) {
        return res.status(200).json(findUser.token);
      }
      return res.status(200).json("Username could not be found !");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
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
          res.cookie("token", findUser.token, {
            secure: true,
            httpOnly: true,
          });
          return res.status(200).json(findUser.token);
        }
        return res.status(500).json("Password is incorrect !");
      }
      return res.status(500).json("Username could not be found !");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
};
//get user
const GetUser = async (req, res) => {
  const findUser = await FindUser({
    token:req.body.token,
  });
  if(findUser){
    return res.status(200).json(findUser);
  }else{
    return res.status(500).json("Get user failed !");
  }
}
//UpdateUser
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
              if (ValidateLength(req.body.newPassword.length, null, 6)) {
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
              return res
                .status(500)
                .json("Password must be more than 6 characters !");
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
      const findUser = await FindUser({
        token: req.body.token,
      });
      if (findUser) {
        try {
          Db.User.update(
            {
              avatar: req.body.avatar,
              updateAt: new Date().getTime(),
            },
            {
              where: {
                id: findUser.id,
              },
            }
          );
          return res.status(200).json("Update successfully !!");
        } catch (err) {
          return res.status(500).json(err.message);
        }
      }
      return res.status(500).json("Token could not be found !");
    }

};
const cookieJwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const user = JWT.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};
module.exports = { SignUp, SignIn, UpdateUser, cookieJwtAuth,GetUser };

const Db = require("../../models");
const { createUserDTO } = require("../models/userDTO");
const { ComparePassword, HashPassword } = require("../services/secret");
const { FindUser, FindAllUser } = require("../services/userService");
const { ValidateLength, ValidateEmail } = require("../services/validate");
const { FriendRqStatus } = require("../services/friendRqService");
const { Op } = require("sequelize");
const JWT = require("jsonwebtoken");
const { FindExistFriend, FindRoom } = require("../services/roomService");
const { FindMessage } = require("../services/messageService");
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
        return res.status(200).json({
          id:findUser.dataValues.id,
          token:findUser.dataValues.token
        });
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
          return res.status(200).json({
            id:findUser.dataValues.id,
            token:findUser.dataValues.token
          });
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
    token: req.body.token,
  });
  if (findUser) {
    return res.status(200).json(findUser);
  } else {
    return res.status(500).json("Get user failed !");
  }
};
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
  if (req.body.status) {
    const findUser = await FindUser({
      token: req.body.token,
    });
    Db.User.update(
      {
        status: req.body.status,
        updateAt: new Date().getTime(),
      },
      {
        where: {
          id: findUser.id,
        },
      }
    );
    return res.status(200).json("Load Status successfully !!");
  }
};
const GetUserAddFriend = async (req, res) => {
  try {
    const Condition = [
      {
        firstName: {
          [Op.like]: `%${req.body.firstName}%`,
        },
      },
      {
        lastName: {
          [Op.like]: `%${req.body.lastName}%`,
        },
      },
    ];
    const userAdd = await FindAllUser({
      [Op.and]: Condition,
    });
    if (userAdd.length != 0) {
      var IndexUserExist = null;
      for (const [index, user] of userAdd.entries()) {
        delete user.userName;
        delete user.passWord;
        delete user.token;
        delete user.createdAt;
        delete user.updatedAt;
        const status = await FriendRqStatus(user.dataValues.id, req.body.id);
        user.dataValues.status = status;
        if (user.dataValues.id === req.body.id) {
          IndexUserExist = index;
        }
      }
      if (IndexUserExist != null) {
        userAdd.splice(IndexUserExist, 1);
      }
      if (req.body.type !== "find") {
        const userType = userAdd.filter((item) => {
          return item.dataValues.status === req.body.type;
        });
        return res.status(200).json(userType);
      }
      return res.status(200).json(userAdd);
    } else {
      return res.status(500).json("This account could not be found !");
    }
  } catch (err) {
    return res.status(500).json("This account could not be found !");
  }
};
const GetChatDetail = async (req, res) => {
  try {
    const RoomDetail = await FindRoom({
      id_User_Owner: req.body.id_User_Owner,
    });
    if (RoomDetail[0].dataValues.list_Id_Friend === "") {
      return res.status(200).json("You don't have any friends yet");
    }
    const listFriends = RoomDetail[0].dataValues.list_Id_Friend.split(",");
    const ListFriendsDetails = [];
    for (const item of listFriends) {
      const userDetail = await FindUser({
        id: item,
      });
      ListFriendsDetails.push({
        id: userDetail.dataValues.id,
        avatar: userDetail.dataValues.avatar,
        firstName: userDetail.dataValues.firstName,
        lastName: userDetail.dataValues.lastName,
        gender: userDetail.dataValues.gender,
        age: userDetail.dataValues.age,
        email: userDetail.dataValues.email,
        status: userDetail.dataValues.status,
      });
    }
    return res.status(200).json(ListFriendsDetails);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
const GetMessage = async (req, res) => {
  try {
    const listMessage = await FindMessage({
      [Op.or]: [
        {
          [Op.and]: [
            {id_User_Send: req.body.id_User_Owner},
          ],
        },
        {
          [Op.and]: [
            {id_User_Receive: req.body.id_User_Owner},
          ],
        },
      ],
    });
    return res.status(200).json(listMessage);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
module.exports = {
  SignUp,
  SignIn,
  UpdateUser,
  GetUser,
  GetUserAddFriend,
  GetChatDetail,
  GetMessage,
};

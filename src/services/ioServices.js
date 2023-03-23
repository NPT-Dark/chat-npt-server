const { FindUser } = require("./userService")
const Db = require("../../models");
const { Op } = require("sequelize");
const { AddFriendRqDTO } = require("../models/friendRqDTO");
const { FindFriendRq } = require("./friendRqService");
const SendAddFriend =async (rq) => {
    const newAddFriend = AddFriendRqDTO(rq)
    await Db.FriendRq.create(newAddFriend);
    const user = await FindUser({
        id:rq.id_User_Send
    })
    return {
        ...rq,
        user:user
    }
}
const ExistFriendRq = async (rq) => {
    const findFriendRq = await FindFriendRq({
        [Op.or]: [
          {
            [Op.and]: [
              { id_User_Recieve: rq.id_User_Recieve },
              { id_User_Send: rq.id_User_Send },
            ],
          },
          {
            [Op.and]: [
              { id_User_Recieve: rq.id_User_Send },
              { id_User_Send: rq.id_User_Recieve },
            ],
          },
        ],
      });
      return findFriendRq
}
module.exports = {SendAddFriend,ExistFriendRq}
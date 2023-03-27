const Db = require("../../models");
const { Op } = require("sequelize");
const { FindExistFriend } = require("./roomService");
const FindFriendRq = async(condition)=>{
    const userFind = await Db.FriendRq.findOne({
           where:condition
   })
   return userFind
}
const FriendRqStatus=async(friend,user)=>{
    const statusSend = await FindFriendRq({
        [Op.and]: [
          { id_User_Recieve: friend },
          { id_User_Send: user },
        ],
      });
      const statusRecieve = await FindFriendRq({
        [Op.and]: [
          { id_User_Recieve: user },
          { id_User_Send: friend },
        ],
      });
      const statusFriend = await FindExistFriend(user,friend)
      if (statusSend !== null) {
        return "send";
      }
      if (statusRecieve !== null) {
        return "recieve";
      }
      if(statusFriend === true){
        return "friend";
      }
      if (statusSend === null && statusRecieve === null) {
        return "normal";
      }
}
module.exports = {FindFriendRq,FriendRqStatus}
const Db = require("../../models");
const { Op } = require("sequelize");
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
      if (statusSend !== null) {
        return "send";
      }
      if (statusRecieve !== null) {
        return "recieve";
      }
      if (statusSend === null && statusRecieve === null) {
        return "normal";
      }
}
module.exports = {FindFriendRq,FriendRqStatus}
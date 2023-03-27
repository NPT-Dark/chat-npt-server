const Db = require("../../models");
const FindRoom = async(condition)=>{
    const userFind = await Db.Room.findAll({
           where:condition
   })
   return userFind
}
const FindExistFriend=async(id,item)=>{
    const ExistFriend = await FindRoom({
        id_User_Owner:id
    })
    if(ExistFriend.length !== 0){
        var array = ExistFriend[0].list_Id_Friend.split(",")
        var check = array.includes(item)
        return check
    }
    return false
}
module.exports = {FindRoom,FindExistFriend}
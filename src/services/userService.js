const Db = require("../../models");
const FindUser = async(condition)=>{
     const userFind = await Db.User.findOne({
            where:condition
    })
    return userFind
}
const FindAllUser = async(condition)=>{
    const userFind = await Db.User.findAll({
           where:condition
   })
   return userFind
}
module.exports = {FindUser,FindAllUser}
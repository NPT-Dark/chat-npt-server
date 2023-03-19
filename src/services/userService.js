const Db = require("../../models");
const FindUser = async(condition)=>{
     const userFind = await Db.User.findOne({
            where:condition
    })
    return userFind
}
module.exports = {FindUser}
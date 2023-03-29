const db = require("../../models")

const FindMessage = async(condition)=>{
    const MessageFind = await db.Message.findAll({
        where:condition
    })
    return MessageFind
}
module.exports = {FindMessage}
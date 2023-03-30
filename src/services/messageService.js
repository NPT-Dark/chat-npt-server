const db = require("../../models")

const FindMessage = async(condition)=>{
    const MessageFind = await db.Message.findAll(
        {
            where:condition,
            order: [
                ["createdAt", "ASC"],
            ]
        },
    )
    return MessageFind
}
module.exports = {FindMessage}
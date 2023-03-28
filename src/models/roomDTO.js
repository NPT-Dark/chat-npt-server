const {v4 : newID} = require("uuid")
const RoomDTO = (request,listFriend) =>{
    const id = newID()
    const newAdd = {
        id_Room: id,
        id_User_Owner: request.id_User_Owner,
        list_Id_Friend:listFriend !== null ? listFriend : request.id_User_Add,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime()
    }
    return newAdd
}
module.exports = {RoomDTO}
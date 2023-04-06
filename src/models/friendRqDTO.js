const { v4: newID } = require("uuid");
const AddFriendRqDTO = (request) => {
  const id = newID();
  const newAdd = {
    id_FriendRq: id,
    id_User_Send: request.id_User_Send,
    id_User_Recieve: request.id_User_Recieve,
    createAt: new Date().getTime(),
    updateAt: new Date().getTime(),
  };
  return newAdd;
};
module.exports = { AddFriendRqDTO };

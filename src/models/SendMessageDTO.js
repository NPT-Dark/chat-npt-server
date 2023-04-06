const { v4: newID } = require("uuid");
const SendMessageDTO = (request) => {
  const id = newID();
  const newMessage = {
    id_Message: id,
    id_User_Send: request.id_User_Send,
    id_User_Receive: request.id_User_Receive,
    Message: request.Message,
    Seen: false,
    createAt: new Date().getTime(),
    updateAt: new Date().getTime(),
  };
  return newMessage;
};
module.exports = { SendMessageDTO };

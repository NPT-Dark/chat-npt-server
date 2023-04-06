const { v4: newID } = require("uuid");
const NotificationDTO = (request) => {
  const id = newID();
  const newAdd = {
    id_Notification: id,
    id_User: request.id_User,
    Message: request.Message,
    Seen: false,
    createAt: new Date().getTime(),
    updateAt: new Date().getTime(),
  };
  return newAdd;
};
module.exports = { NotificationDTO };

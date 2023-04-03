const { FindUser } = require("./userService");
const Db = require("../../models");
const { Op } = require("sequelize");
const { AddFriendRqDTO } = require("../models/friendRqDTO");
const {RoomDTO} = require("../models/roomDTO");
const { FindFriendRq } = require("./friendRqService");
const { FindRoom } = require("./roomService");
const { SendMessageDTO } = require("../models/SendMessageDTO");
const { NotificationDTO } = require("../models/notificationDTO");
const SendAddFriend = async (rq) => {
  const newAddFriend = AddFriendRqDTO(rq);
  await Db.FriendRq.create(newAddFriend);
  const user = await FindUser({
    id: rq.id_User_Send,
  });
  return {
    ...rq,
    user: user,
  };
};
const CancelFriend = async (rq) => {
  const findFriendRq = await FindFriendRq({
    [Op.and]: [
      { id_User_Recieve: rq.id_User_Recieve },
      { id_User_Send: rq.id_User_Send },
    ],
  });
  await Db.FriendRq.destroy({
    where: {
      id_FriendRq: findFriendRq.dataValues.id_FriendRq,
    },
  });
};
const ExistFriendRq = async (rq) => {
  const findFriendRq = await FindFriendRq({
    [Op.or]: [
      {
        [Op.and]: [
          { id_User_Recieve: rq.id_User_Recieve },
          { id_User_Send: rq.id_User_Send },
        ],
      },
      {
        [Op.and]: [
          { id_User_Recieve: rq.id_User_Send },
          { id_User_Send: rq.id_User_Recieve },
        ],
      },
    ],
  });
  return findFriendRq;
};
const AcceptFriendRq = async (rq) => {
    const findRoom = await FindRoom({
      id_User_Owner: rq.id_User_Owner,
    })
    if(findRoom.length === 0){
      await Db.Room.create(RoomDTO(rq,null));
    }else{
      var array = []
      if(findRoom[0].dataValues.list_Id_Friend !== ''){
        array = findRoom[0].dataValues.list_Id_Friend.split(',');
      }
      array.push(rq.id_User_Add);
      await Db.Room.update(RoomDTO(rq,array.toString()),{
        where: {
          id_Room: findRoom[0].dataValues.id_Room
        }}
        );
    }
}
const UnfriendService = async (rq) => {
  const FindRoomDetail = await FindRoom({
    id_User_Owner: rq.id_User_Owner,
  })
  const array = FindRoomDetail[0].dataValues.list_Id_Friend.split(",");
  const newArray = []
  for(var item of array){
    if(item !== rq.id_User_Unfriend){
      newArray.push(item);
    }
  }
  await Db.Room.update(RoomDTO(rq,newArray.toString()),{
    where: {
      id_Room: FindRoomDetail[0].dataValues.id_Room
    }}
    );
}
const SendMessage = async(rq)=>{
  try{
    await Db.Message.create(SendMessageDTO(rq))
    return "Send Success";
  }catch(err){
    return err.message;
  }
}
const UpdateSeen = async (rq) => {
  try {
        await Db.Message.update({
          Seen:true
        },
          {
            where:{
              id_User_Send:rq.id_User_Receive ,
              id_User_Receive: rq.id_User_Send,
            }
          }
        )
    return true
  } catch (err) {
    return false;
  }
}
const AddNotification = async (rq) => {
  try{
    var userSendDT = await FindUser({
      id:rq.id_User_Send
    })
    var message = ""
    if(rq.type === "send-invite"){
      message = "You received a friend request from " + userSendDT.firstName + " " + userSendDT.lastName
    }
    if(rq.type === "accept-invite"){
      message = userSendDT.firstName + " " + userSendDT.lastName + " accepted your friend request"
    }
    if(rq.type === "unfriend"){
      message = userSendDT.firstName + " " + userSendDT.lastName + " unfriended you"
    }
    var newNoti = NotificationDTO({
      ...NotificationDTO,
      id_User:rq.id_User_Recieve,
      Message:message
    });
    await Db.Notification.create(newNoti)
  }catch(err){
    throw new Error(err.message)
  }
}
module.exports = { SendAddFriend, ExistFriendRq, CancelFriend,AcceptFriendRq,UnfriendService,SendMessage,UpdateSeen,AddNotification };

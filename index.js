//const
const express = require("express");
const ConnectDB = require("./src/database/connectDb");
const routers = require("./src/routers");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { SendAddFriend, ExistFriendRq, CancelFriend, AcceptFriendRq, UnfriendService, SendMessage, UpdateSeen } = require("./src/services/ioServices");
const { FindUser } = require("./src/services/userService");
const { FindRoom, UpdateStatus } = require("./src/services/roomService");
const { FindMessage } = require("./src/services/messageService");
require("dotenv").config();
const app = express();
//TODO: Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:3002","https://chat-npt-client.vercel.app","chat-npt-client-khd43ytl0-npt-dark.vercel.app","https://chat-npt-client-git-s3-npt-dark.vercel.app"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
//TODO:Connect Database
ConnectDB();
//TODO:Router
app.use("/api/", routers);
//TODO:Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:3002","https://chat-npt-client.vercel.app","chat-npt-client-khd43ytl0-npt-dark.vercel.app","https://chat-npt-client-git-s3-npt-dark.vercel.app"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`${data} da vao phong`);
  });
  //TODO:Chat
    //**Send Message */
  socket.on("send_message", async(data) => {
    const send = await SendMessage(data)
    socket.to(data.id_User_Receive).emit("receive_message",send );
  });
    //**Update Status(Online,Offline) */
  socket.on("update_status", async (data) => {
    const listFriend = await FindRoom({
      id_User_Owner:data.id_User_Owner,
    })
    await UpdateStatus(data.id_User_Owner,data.status)
    if(listFriend.length !== 0){
      const array = listFriend[0].dataValues.list_Id_Friend.split(",");
      for(const id_Friend of array){
        socket.to(id_Friend).emit("receive_friend_status","Have a friend who is online");
      }
    }
  });
    //*Seen Message */
  socket.on("send_seen_message",async (data) => {
    const update = await UpdateSeen(data);
    if(update){
      const message = await FindMessage({
        id_User_Receive:data.id_User_Send,
        id_User_Send:data.id_User_Receive,
      })
      if(message.length > 0){
        socket.to(data.id_User_Receive).emit("receive_seen_message",message[message.length - 1].id_Message);
      }
    }
  })
  //TODO: Friends
    //**Send Invitation */
  socket.on("send_invitation", async (data) => {
    if (await ExistFriendRq(data) === null) {
      const getUser = await SendAddFriend(data);
      socket.to(data.id_User_Recieve).emit("receive_invitation", getUser);
    }
  });
    //**Cancel Invitaiton */
  socket.on("send_cancel_invitation", async (data) => {
      await CancelFriend(data)
      socket.to(data.id_User_Recieve).emit("receive_cancel_invitation", "Cancel successfully");
  });
    //**Accept Invitation */
  socket.on("accept_invitation", async (data) => {
    await CancelFriend({
      id_User_Recieve: data.id_User_Owner,
      id_User_Send: data.id_User_Add,
    })
    await AcceptFriendRq(data)
    await AcceptFriendRq({
      id_User_Owner:data.id_User_Add,
      id_User_Add:data.id_User_Owner,
    })
    const userDetail = await FindUser({
      id:data.id_User_Owner
    })
    socket.to(data.id_User_Add).emit("receive_accept_invitation", `${userDetail.dataValues.firstName + " " + userDetail.dataValues.lastName} has accepted your friend request`);
  });
  //** Unfriend */
  socket.on("send_unfriend", async (data) => {
    const userDetail = await FindUser({
      id:data.id_User_Owner
    })
    await UnfriendService(data)
    await UnfriendService({
      id_User_Owner:data.id_User_Unfriend,
      id_User_Unfriend:data.id_User_Owner,
    })
    socket.to(data.id_User_Unfriend).emit("receive_unfriend", `${userDetail.dataValues.firstName + " " + userDetail.dataValues.lastName} has unfriended you`);
  });
  //** Disconnect*/
  socket.on("disconnect", () => {
  });
});
//TODO: Server
server.listen(2401, () => {
  console.log("Server listening on port " + process.env.PORT);
});

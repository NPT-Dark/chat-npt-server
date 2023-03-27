//const
const express = require("express");
const ConnectDB = require("./src/database/connectDb");
const routers = require("./src/routers");
const cors = require("cors");
const { Server } = require("socket.io");
const { Op } = require("sequelize");
const http = require("http");
const { SendAddFriend, ExistFriendRq, CancelFriend, AcceptFriendRq, UnfriendService } = require("./src/services/ioServices");
const { FindFriendRq } = require("./src/services/friendRqService");
const { FindUser } = require("./src/services/userService");
require("dotenv").config();
const app = express();
//middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
//connect db
ConnectDB();
//router
app.use("/api/", routers);
//socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  //Chat
  socket.on("send_message", (data) => {
    socket.to(data.id_Room).emit("receive_message", data);
  });
  //Friends
  socket.on("send_invitation", async (data) => {
    if (await ExistFriendRq(data) === null) {
      const getUser = await SendAddFriend(data);
      socket.to(data.id_User_Recieve).emit("receive_invitation", getUser);
    }
  });
  socket.on("send_cancel_invitation", async (data) => {
      await CancelFriend(data)
      socket.to(data.id_User_Recieve).emit("receive_cancel_invitation", "Cancel successfully");
  });
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
  //disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
//server
server.listen(2401, () => {
  console.log("Server listening on port " + process.env.PORT);
});

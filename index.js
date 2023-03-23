//const
const express = require("express");
const ConnectDB = require("./src/database/connectDb");
const routers = require("./src/routers");
const cors = require("cors");
const { Server } = require("socket.io");
const { Op } = require("sequelize");
const http = require("http");
const { SendAddFriend, ExistFriendRq } = require("./src/services/ioServices");
const { FindFriendRq } = require("./src/services/friendRqService");
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
    console.log(`User with ID: ${socket.id} joined room : ${data}`);
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
  // socket.on("send_cancel_invitation", async (data) => {
  //   if (await ExistFriendRq(data) === null) {
  //     const getUser = await SendAddFriend(data);
  //     socket.to(data.id_User_Recieve).emit("receive_cancel_invitation", getUser);
  //   }
  // });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
//server
server.listen(2401, () => {
  console.log("Server listening on port " + process.env.PORT);
});

//const
const express = require('express');
const ConnectDB = require('./src/database/connectDb');
const routers = require('./src/routers');
const cors = require('cors');
const {Server} = require("socket.io")
const http = require('http');
require('dotenv').config();
const app = express();
//middleware
app.use(express.json());
app.use(cors({
        origin:["http://localhost:3000"],
        methods:["GET","POST","PUT"],
        credentials:true
}
));
//connect db
ConnectDB();
//router
app.use("/api/",routers)
//socket
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET","POST","PUT"],
        credentials:true,
    }
})
io.on("connection",(socket)=>{
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room : ${data}`);
    })
    socket.on("send_message",(data)=>{
        socket.to(data.id_Room).emit("receive_message",data)
    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id);
    })
})
//server
server.listen(2401,()=>{
    console.log("Server listening on port " + process.env.PORT);
})
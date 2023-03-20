//const
const express = require('express');
const ConnectDB = require('./src/database/connectDb');
const routers = require('./src/routers');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {Server} = require("socket.io")
require('dotenv').config();
const app = express();
//middleware
app.use(express.json());
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","POST","PUT"],
    credentials:true
}));
app.use(cookieParser())
//connect db
ConnectDB();
//router
app.use("/api/",routers)
//server
app.listen(process.env.PORT || 5000,()=>{
    console.log("Server listening on port " + process.env.PORT);
})
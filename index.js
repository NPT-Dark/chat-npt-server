//const
const express = require('express');
const ConnectDB = require('./src/database/connectDb');
const Db = require('./models');
const routers = require('./src/routers');
require('dotenv').config();
const app = express();
//middleware
app.use(express.json());
//connect db
ConnectDB();
//router
app.use("/api/",routers)
//server
app.listen(process.env.PORT || 5000,()=>{
    console.log("Server listening on port " + process.env.PORT);
})
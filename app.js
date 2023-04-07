// const { log } = require("console")
const mongoose= require("mongoose")
const express = require("express");
const app = express();


const dotenv = require("dotenv")
dotenv.config({path:'./config.env'})
const port= process.env.PORT; 
require('./db/connection');

app.use(express.json());


app.use(require("./router/buyauth"));
app.use(require("./router/auth"));
app.use(require("./router/sellauth"));
app.use(require("./router/signupauth"));
app.use(require("./router/trial"));
app.use(require("./router/admin"));
// app.use(require("./router/trial"))
// app.use(require("../"))
// app.use(require("./router/"))
app.listen(port, ()=>{
    console.log(`listening to  port no ${port}`)
})
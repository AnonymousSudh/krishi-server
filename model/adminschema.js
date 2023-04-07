const  mongoose  = require("mongoose");

// const conn = require("../db/connection")

const feedback = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    }
})


// user_table will be a collection name  in the login databae inside krishi project
// loginSchema is the schema of our data which we want to send in the usertable collection.
const feedback_list = new mongoose.model("feedback_lisst", feedback);

module.exports = feedback_list;
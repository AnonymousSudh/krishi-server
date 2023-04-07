const mongoose = require("mongoose")

const msg = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_table"
    },
    reason:String,
    message:String 

})

const messagelist = new mongoose.model('message_table', msg);
module.exports = messagelist
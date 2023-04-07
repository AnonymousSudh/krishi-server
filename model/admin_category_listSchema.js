const mongoose = require("mongoose")


const category = new mongoose.Schema({
    category_Name:String
})

const categorylist = new mongoose.model("category_list",category)
module.exports = categorylist 
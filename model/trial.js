const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const trialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }

}, 
{
    timestamps:true
})

module.exports = trialSchema;
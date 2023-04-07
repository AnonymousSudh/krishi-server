const mongoose = require("mongoose");


const uploadcrop = new mongoose.Schema({

    category_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "category_list"

    },
    crop_Namee: String
     
        // require:true



})
 


// const feedback_list = conn.adminn.model("feedback_lisst", feedback);
const uploadcropp = new mongoose.model("crop_list", uploadcrop)
module.exports = uploadcropp

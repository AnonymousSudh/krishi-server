// const mongoose = require("mmongoose");

const express = require("express")
const router = express.Router();

const allcropdata = require('../model/admin_crop_varietyschema')
const croplist = require('../model/admin_crop_listingschema')




router.get('/getAllPopulatedData', async(req,res)=>{

    const data =  await allcropdata.find()
    .populate({
        path:"crop_id",
        select:"crop_Namee"
    })
 

    console.log(data);

})


module.exports = router;
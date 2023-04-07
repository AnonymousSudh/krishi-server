const express = require("express");
const router = express.Router();
require('../db/connection');
const sellcrop = require("../model/sell_crop_schema")
const admin_crop_list = require("../model/admin_crop_listingschema")
const admin_varietywithcropid_list = require("../model/admin_crop_varietyschema")
const userschema = require("../model/userschema")
const adminCategoryList = require("../model/admin_category_listSchema")
// var nestedPop = require('nested-pop');
// const cloudinary = require('cloudinary').v2




router.get("/getcategory", async (req, res) => {  //at categotycrops
    const data = await adminCategoryList.find();
    // console.log("hello");
    // console.log(data);
    // console.log(data[0].category_Name);

    res.send(data);
})

router.post("/getCropForBuy", async (req, res) => {  //at categoryCrops

    const { category_id } = req.body
    // console.log(category_id);

    const data = await admin_crop_list.find({ category_id: category_id })
    // console.log(data);
    var cropArrayForBuy = [];
    data.map((val) => {
        cropArrayForBuy.push({ "_id": val._id, "cropName": val.crop_Namee })
    })
    console.log(cropArrayForBuy);
    res.send(cropArrayForBuy);

})


router.post('/getAllBuyingData', async (req, res) => {     // at buycrop.jsx

    const { crop_id } = req.body

    const buy_data = await sellcrop.find({ crop_name_id: crop_id })
        .populate("category_id",["category_Name"])
        .populate("crop_name_id",["crop_Namee"])
        .populate("variety_id",["variety_Name"])
        .populate("seller_id", ["name", "email", "imageuri", "phoneno", "address"])

    console.log(buy_data);

    res.send(buy_data)


})





module.exports = router;
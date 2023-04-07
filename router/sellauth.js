const express = require("express");
const router = express.Router();
require('../db/connection');
const sell_crop_schema = require("../model/sell_crop_schema")
const admin_category_schema = require("../model/admin_category_listSchema")
const admin_crop_list = require("../model/admin_crop_listingschema")
const admin_varietywithcropid_list = require("../model/admin_crop_varietyschema")

// router.get("/Sell_crops",(req,res)=> {
//     res.send("hello from the express side")
// });




router.get("/getcategory", async (req, res) => {  // at sell_crops
    // console.log("inside router");
    const data = await admin_category_schema.find();
    // console.log(data);
    res.send(data);
})


router.post('/getcrop', async (req, res) => {  // at sell_crops
    const { categoryname, categoryid } = req.body;
    // console.log(categoryname);
    // console.log(categoryid);
    const data = await admin_crop_list.find({ category_id: categoryid })
    console.log(data);
    var cropArray = []
    data.map((val) => {
        const id = val._id
        const cropName = val.crop_Namee
        cropArray.push({ "_id": id, "cropName": cropName })
    })

    console.log(cropArray);

    res.status(200).send(cropArray)

})

router.post("/getvariety", async (req, res) => {
    const { crop_id, crop } = req.body;

    const data = await admin_varietywithcropid_list.find({ crop_id: crop_id });
    console.log("hello");
    console.log(data);
    // try {


        var varietyArray = [];

        data.map((val) => {
            varietyArray.push({ "_id": val._id, "varietyName": val.variety_Name })
        })
        console.log(varietyArray);
        res.send(varietyArray)
    // } catch (error) {
    //     console.log(error);

    // }
})

// router.post("/getnewvarietyid", async (req, res) => {
//     const { varietyname } = req.body;
//     const data2 = await allvariety.findOne({ variety: varietyname });
//     // console.log(data2._id);
//     res.send(data2._id)


// })



router.post("/Sell_crops", async (req, res) => {
    try {
        // console.log(req.body);
        const sellerid = req.cookies.userid;
        console.log("this is seller id");
        console.log(sellerid);
        const { crop_id, variety_id, price, quantity, category_id, unit } = req.body
        // console.log(crop_id);

        if (!crop_id || !variety_id || !price || !quantity || !category_id || !unit) {

            return res.status(400).json({ error: "enter all the details " })

            // alert("please fill all the data");
        }
        const userr = await sell_crop_schema({
            category_id: category_id,
            crop_name_id: crop_id,
            variety_id: variety_id,
            seller_id: sellerid,
            price,
            quantity,
            unit

        }).save();
        console.log("i am at sell auth");
        console.log(userr);

        if (userr) {
            res.status(200).send();
        }

    } catch (err) {
        console.log(err);
    }

});


module.exports = router;
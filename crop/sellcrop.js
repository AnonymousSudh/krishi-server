const express = require("express")

const sell_crop_list = require("../model/sell_crop_schema")
const router = express.Router();



router.post("/Home", async(req,res)=>{

    try {
        const {crop_name, variety, price, quantity} = req.body;
        console.log(crop_name);
        
    } catch (error) {
        console.log(error);
        
    }
})



module.exports = router;

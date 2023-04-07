// const { LOADIPHLPAPI } = require("dns");
const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");

const router = express.Router();
require('../db/connection');
// require('../router')

const feedback_list = require("../model/adminschema");
const userList = require("../model/userschema");
// const emaillogindata = require("../model/emailloginschema");
// const sellcrop = require('../model/sell_crop_schema')
const allSelledCrop = require("../model/sell_crop_schema")
const admin_categoty_schema = require("../model/admin_category_listSchema")
const admin_crop_list = require("../model/admin_crop_listingschema")

const authenticate = require("../middleware/authenticate");
const sell_crop_list = require("../model/sell_crop_schema");
router.use(cookieParser())
const cloudinary = require('cloudinary').v2


// creating a post method for signup page , so that user data may get save to our database

router.post("/signInWithGmail", async (req, res) => {   //at login.jsx

    // console.log(req.body);
    const google_data = req.body;
    const user_google_data = google_data.response.profileObj;
    const user_id_token = google_data.response.tokenId;

    const email = user_google_data.email;
    const imageuri = user_google_data.imageUrl;
    const name = user_google_data.name;
    const google_token = google_data.response.tokenId;

    console.log(`the Gmail which you login  from is ${email} `);
    const pre_email = await userList.findOne({ email: email })
    // console.log(pre_email);

    if (!pre_email) {

        console.log(`you are login first time with above email `);
        if (email == "mauryasudhanshu930@gmail.com") {
            // res.status(205)


            const user = await userList({
                name, email, imageuri, google_token
            }).save();

            res.cookie("google_token", google_token, { // here we storing our token in cookies
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true

            })



            console.log(user);
            // return res.redirect(200,'/adminpanel')
            // console.log("after redirect");
            data = { "userid": user._id }
            res.status(200).send(data);
            // }

        } else {

            const user = await userList({
                name, email, imageuri, google_token
            }).save();
            // localStorage.setItem()

            res.cookie("google_token", google_token, {      // here we storing our token in cookies
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true

            })

            res.cookie("userid", user._id, {        // here we storing our userid in cookies
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true

            })



            res.status(203).send(user._id);
        }


    }

    if (pre_email) { // for old user
        console.log("i am  at 91 line");
        console.log(pre_email);
        if (pre_email.email == "mauryasudhanshu930@gmail.com") {
            try {

                console.log(pre_email.email);
                console.log(pre_email._id);
                // res.status(205).send(pre_email._id);
                // res.redirect('/adminpanel').send(pre_email._id);
                console.log("i am  at 99 line");

                const update = await userList.updateOne({ _id: pre_email._id }, {
                    $set: {
                        google_token
                    }
                }
                );
                console.log("i am  at 107 line");

                res.cookie("google_token", google_token, { // here we storing our token in cookies
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                // console.log("i am  at 114 line");

                console.log("at auth.js line no 105`");
                console.log(pre_email);
                // res.cookie("userid", pre_email._id, { // here we storing our token in cookies
                //     expires: new Date(Date.now() + 25892000000),
                //     httpOnly: true

                // })

                data = { "userid": pre_email._id }
                res.status(200).send(data);

            } catch (error) {
                console.log(error);
            }
        }





        else {

            const update = await userList.updateOne({ _id: pre_email._id }, {
                $set: {
                    google_token
                }
            }
            );

            // console.log(update);

            res.cookie("google_token", google_token, { // here we storing our token in cookies
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });
            console.log("at auth.js line no 105`");
            console.log(pre_email);
            // res.cookie("userid", pre_email._id, { // here we storing our token in cookies
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true

            // })
            data = { "userid": pre_email._id }
            res.status(201).send(data);

        }

    }




});




//         // userList.findOne({ email: login_email, password: login_password });



router.post('/adminpanel', async (req, res) => {

    const namee = req.body;
    const name = namee.name;

    const dataas = await feedback_list({
        name
    }).save();

})




//creating post method to get the data which a user fill in sign_in box(email, password)
router.post("/signin", async (req, res) => {  // at login.jsx

    try {
        // we are getting all the data through object descrutering 
        const { login_email, login_password } = req.body
        // console.log("hello");
        console.log(login_email);
        console.log(login_password);

        // check validataion if user fill the box or not
        if (!login_email || !login_password) {

            res.status(402).json("please fill the data")
        }
        // search for data that the user enter with our database table in mongodb

        const result = await userList.findOne({ email: login_email, password: login_password });
        console.log(`this is data from mongodb in auth file ${result}`);


        if (result) {
            console.log(result);
            // const isMatch = await bcrypt.compare(password, userLogin.password)
            // console.log("hello 1");
            token = await result.generateAuthToken();
            // console.log("hello 2");
            // console.log(token)
            // console.log("hello 3");

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true


            })

            res.cookie("userid", result._id, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true


            })
            res.status(200).send([result._id,result.email,result.imageuri,result.address]);
        }

        // }
        else {
            res.status(400).json({ error: "user error" })
        }


    } catch (err) {
        console.log(err);
    }



});



router.post('/Enter_details', authenticate, async (req, res) => {
    try {
        const token = req.cookies.google_token;
        console.log(req.body);
        const { phoneno, address, usertype } = req.body
        // console.log(phoneno);



        // const update = await userList.update({ google_token: token }, {
        //     $set: {name: '85767'}
        // })

        // const update = await userList.insert( { item: "card"} )

        // const update = await userList.aggregate([
        //     {
        //        $addFields:{"phonemo":3300} 
        //     }
        // ])
        const update = await userList.updateMany({ google_token: token },
            [
                {
                    "$addFields": { "phoneno": phoneno }

                },
                {
                    "$addFields": { "address": address }
                },
                {
                    "$addFields": { "usertype": usertype }
                }
            ])

        // const data = await userList.findOne({ google_token: token })
        // console.log(data);

        res.status(201).send();

    } catch (err) {
        console.log(err);
    }

    // console.log();
    // res.status(201).json(email);

})

router.get('/about', authenticate, (req, res) => {  //at about.jsx

    console.log("about us");
    console.log(req.rootUser);
    // cloudinary.url("sample.jpg", {width: 100, height: 150, crop: "fill", fetch_format: "auto"})
    res.send(req.rootUser);

})

// router.get('/getUserData',autheenticate)

router.post('/uploadphoto', async (req, res) => {
    console.log("i am at server upload photo");
    const { imgurl, userid } = req.body

    console.log(imgurl);
    console.log(userid);

    const seturl = await userList.updateOne({ id: userid },

        [{
            "$addFields": { "imageuri": imgurl }

        }]
        // {
        //     "$addFields":{"imageuri":imgurl}
        // }

    )
    console.log(seturl);
    if(seturl){
        console.log(res.status);
        res.status(200).send();
    }
    





})


// router.get('/weather', authenticate, async (req, res) => {

//     // console.log(`this is all the data from auth ${req.rootUser}`);
//     // try {
//     const address = req.rootUser;
//     // res.status(200).send(req.rootUser);

//     //     // const address = await userList.findOne(/);
//     //     // console.log(address);
//     res.status(200).send(address);

//     // } catch (err) {
//     //     console.log(err);
//     // }
//     // res.send(req.rootUser);

// })



router.get('/logout', (req, res) => {

    res.clearCookie('jwtoken');
    res.clearCookie('google_token');
    res.status(200).send();



})



router.get('/getUserCrop', async (req, res) => { // yourcrop
    const userid = req.cookies.userid;
    console.log(userid);
    // console.log("hello");
    const data = await allSelledCrop.find({ seller_id: userid })
        .populate("category_id", "category_Name")
        // .populate("seller_id", "address")
        .populate("crop_name_id", ["crop_Namee"])
        .populate("variety_id", ["variety_Name"])

    console.log(data);
    // localStorage.getItem("userid")
    // data.polpuate("crop_name_id")
    res.status(200).send(data);



})

router.get('/home', authenticate, (req, res) => {



})






router.post("/updateOwnCrop", async (req, res) => { //at updateCardCrop 
    try {
        // const {id} = req.body

        const { quantity, price, id, unit } = req.body;

        const updatedata = await allSelledCrop.updateOne({ _id: id }, {
            $set: {
                price: price,
                quantity: quantity,
                unit: unit
            }
        })
        if (updatedata) {
            res.status(200).send();
        }
        // console.log(updatedata);


    } catch (error) {
        console.log(error);

    }


})





router.post("/deleteOWnCrop", async (req, res) => {  //at yourcardcrop
    const { id } = req.body;
    const deletedata = await sell_crop_list.deleteOne({ _id: id });
    // console.log(deletedata);
    if (deletedata) {
        res.status(200).send()
    }
})





module.exports = router;
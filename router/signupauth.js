const express = require("express");
const userList = require("../model/userschema");
const router = express.Router();
const nodemailer = require("nodemailer")


router.post('/signup_email', async (req, res) => {
    // console.log(req.body);

    try {
        const { name, email, password, address, phoneno } = req.body;
        // generate random otp here 
        var otp2 = Math.floor(Math.random() * 10000);
        var otp = otp2.toString();
        const lengh = otp.length;

        if (lengh == 3) {

            otp = "0" + otp
        }

        console.log(otp);
        // userList.findOne({ email: login_email, password: login_password });
        const pre_email = await userList.findOne({ email: email });

        console.log(`this is email from signAUHT ${pre_email}`);

        if (!name || !email || !password || !address || !phoneno) {
            res.status(400).send();
        }

        else if (pre_email) {
            res.status(422).send();

        }

        else if (!pre_email) {

            // const email_login_data = await userList({
            //     name,email, password, address, phoneno, otp
            // }).save()

            // res.cookie("google_token", google_token, { // here we storing our token in cookies
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true

            // })

            // async function main() {
            try {
                // const time=5;

                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.MAIL_ACC,
                        pass: process.env.MAIL_PASS,
                    },
                });

                const options = {
                    from: process.env.MAIL_ACC,
                    to: `${email}`,
                    subject: "Your OTP For Krishi",
                    text: `Dear valuable Krishi, ${otp} is your OTP`

                }
                // setTimeout(() => {
                //     const time=5;

                // }, 5000);
                const info = await transporter.sendMail(options);

                console.log(info);
                // console.log("this is time");
                // console.log(time);

                if (info) {

                    const email_login_data = await userList({
                        otp, name, email, address, phoneno
                    }).save();


                    res.status(201).send();
                }


            } catch (error) {
                console.log(error);
                res.status(401).send();

            }

            // create reusable transporter object using the default SMTP transport

            // }


        }




    } catch (error) {
        console.log(error);

    }

})

router.post('/validate_otp', async (req, res) => {
    const otp = req.body.otpvlaue;
    const password = req.body.password;
    try {
        const validate = await userList.findOne({ otp: otp });

        console.log(validate);

        if (validate) {

            // db.detail.update( { "Color": "white" }, { $unset: { "Model": " " }} )
            const update = await userList.update(validate,
                [
                    {
                        $set: {
                            "otp": ""
                        }
                    },
                    {
                        "$addFields": { "password": password }
                    }
                ]);


            // res.cookie("google_token", google_token, { // here we storing our token in cookies
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true

            // })
            res.status(201).send();

        }
        else {
            res.status(401).send();
        }
    } catch (error) {
        res.send(error)
        console.log(error);

    }


})




module.exports = router; 
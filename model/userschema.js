const  mongoose  = require("mongoose");
const jwt = require("jsonwebtoken");

const loginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    }
    ,
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String
    },
    imageuri:{
        type:String
        // required:true
    },
    google_token:{
        type:String

    }, 
    // tokenn:{
    //     type:String,
    // },
    phoneno:{
        type:Number,
        // require:true
    },
    password:{
        type:String,
        // required:true
    },
    address:String,
        // required:tru,
    
    tokens:[
        {
            token:{

                type:String,
                required:true
            }
        }
    ]
})

// generting a token
loginSchema.methods.generateAuthToken = async function(){
    try{
        
        let token = jwt.sign({_id:this._id} , process.env.SECRET_KEY); // jwt.sign is used to generate token
        // console.log("this is token again from userschema ");
        // console.log(token);

        this.tokens = this.tokens.concat({token:token}) 
        await this.save();  // this will save the token to the database 
        return token;
    }catch (err){ 
        console.log(err);
    }
}
 



// user_table will be a collection name  in the login databae inside krishi project
// loginSchema is the schema of our data which we want to send in the usertable collection.
const userList = new mongoose.model("user_table", loginSchema);

module.exports = userList;
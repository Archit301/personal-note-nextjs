import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]  
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    verifyCode:{
        type:String,
       // required:[true,"Verify Code is required"] 
    },
    verifyCodeExpiry:{
        type:Date,
       // required:[true,"Verify Code Expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
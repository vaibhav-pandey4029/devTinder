const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        },
    },
    photoURL:{
        type:String,
    },
    skills:{
        type:[String]
    },
    about:{
        type:String,
        default:"Default Description here",
    }
},{
    timestamps: true
});

const User = mongoose.model('User',userSchema);
module.exports = {User};
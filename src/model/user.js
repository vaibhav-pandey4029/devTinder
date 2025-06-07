const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

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
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not Valid");
            }
        }
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
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
        default:"https://www.w3schools.com/w3images/avatar6.png"
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

userSchema.methods.getJWT = function(){
    const user = this;
    const token = jwt.sign({_id:user._id},"Vaibhav@92346je",{expiresIn:'1d'});
    return token;
}

userSchema.methods.validatePassword = function (passwordInputByUser){
    const user = this;
    const isPasswordValid = bcrypt.compare(passwordInputByUser,user.password);
    return isPasswordValid;
}

const User = mongoose.model('User',userSchema);
module.exports = {User};
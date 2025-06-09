const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const {User} = require("../model/user")
const {validateSignUpData} = require("../utils/validators");

//Login API
authRouter.post("/login",(async (req,res)=>{
    try {
        const {emailId,password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Email is not valid");
        }
        const user = await User.findOne({emailId:emailId});
        if(!user){
            return res.status(404).send("Invalid credentials");
        }
        const isValidPassword = await user.validatePassword(password);
        if(!isValidPassword){
            return res.status(404).send("Invalid credentials");
        }
        const token = user.getJWT();
        res.cookie('token',token);
        res.send("LoggedIn successfully");
    } catch (error) {
        res.status(500).send("Error : "+error.message)
    }
}))

//Signup API
authRouter.post("/signup",async (req,res)=>{
    // create a new instance of user model using the object now it is dynamic
    try{
        //validating the data
        validateSignUpData(req);
        const {firstName,lastName,emailId,password} = req.body;
        //encrypting the password
        const passwordHash = await bcrypt.hash(password,10);
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        await newUser.save();
        res.send("User added successfully")
    }catch(error){
        res.status(400).send("Error while creating user"+error.message);
    }
})

//Logout API
authRouter.post("/logout",(req,res)=>{
    try {
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("Logged out Successfully");
    } catch (error) {
        res.status(500).send("Error while logging out "+error.message);
    }
})

module.exports = {
    authRouter,
}
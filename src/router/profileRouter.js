const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const { User } = require("../model/user");
const validator = require("validator");
const {validateProfileEditData} = require("../utils/validators")

//Profile API
profileRouter.get('/profile/view',userAuth,async (req,res)=>{
    //cookies will be undefined if we will not add cookie-parser middleware
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send("Error: "+error.message);
    }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{
        if(!validateProfileEditData(req)){
            res.status(400).send("Invalid Data to edit");
        }
        //TODO: check if profile url is present make sure it is valid url
        //Add validation so that skills array size should not exceed to some limit
        //Add validation to limit length of about
        const user = await User.findById(req.user._id);
        Object.keys(req.body).forEach((key)=>user[key]=req.body[key]);
        await user.save();
        res.send("User Updated successfully");
    }catch(error){
        res.status(500).send("Error while editing the user details : "+error.message)
    }
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
    try {
        //check if current password entered is correct
        const {password,currentPassword,passwordConfirm} = req.body;
        const user = await User.findById(req.body._id);
        const isPasswordValid = user.validatePassword(currentPassword);
        if(!isPasswordValid){
            res.status(401).send("Password is invalid");
        }
        //check if password matches with new password
        if(password!==passwordConfirm){
            res.status(400).send("password not matching");
        }
        //check if password is strong
        if(!validator.isStrongPassword(password)){
            res.status(400).send("Please enter a strong password");
        }
        const passwordHash = await bcrypt.hash(password,10);
        user[password]=passwordHash;
        await user.save();
        res.send("Password updated successfully");
    } catch (error) {
        res.status(500).send("Error in updating password "+error.message)
    }
})

module.exports = {
    profileRouter
}
const express = require("express");
const userRouter = express.Router();
const {User} = require("../model/user")

//API to fetch the single user by emailId
userRouter.get("/user",async (req,res)=>{
    try{
        const user = await User.findOne({emailId:req.body.emailId});
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send(user)
        }
    }catch(err){
        res.status(500).send("Something went wrong"+error.message);
    }
})

//Delete User API
userRouter.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted");
    } catch (error) {
        res.status(500).send("Error in deleting the user"+error.message);
    }
})

//Update API 
userRouter.patch("/user/:userId", async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try {
        //TODO: we can add more keys here which should not get changed
        const NOT_ALLOWED_Updates = ["emailId","userId"];
        const isUpdateAllowed = Object.keys(data).every((key)=>{
            return !NOT_ALLOWED_Updates.includes(key)
        });
        if(!isUpdateAllowed){
            throw new Error("Changing email Id is not Allowed");
        }
        const user = await User.findByIdAndUpdate(userId,data,{returnDocument:"after",runValidators:true});
        res.send(user);
    } catch (error) {
        res.status(500).send("Error while updating the user"+error.message);
    }
})

//API to fetch all the users for feed
userRouter.get("/feed", async (req,res)=>{
    try {
        const users = await User.find({});
        if(users.length===0){
            res.status(404).send("No user are present");
        }else{
            res.send(users);
        }
    } catch (error) {
        res.status(500).send("Something went wrong"+error.message);
    }
})

module.exports ={
    userRouter
}
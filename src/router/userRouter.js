const express = require("express");
const userRouter = express.Router();
const {User} = require("../model/user")
const {userAuth} = require('../middleware/auth')
const {ConnectionRequestModel} =require("../model/requests")

//To fetch all the requests received by user
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        const connections = await ConnectionRequestModel.find({
            status:"interested",    
            toUserId:user._id
        }).populate("fromUserId","firstName lastName")
        res.json({
            message:"Requests fetched Successfully",
            data:connections
        })
    }catch(err){
        res.status(500).send("Something went wrong"+error.message);
    }
})

//To fetch all the conections of the user
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            status:"accepted",
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).populate("fromUserId","firstName lastName").populate("toUserId","firstName lastName");
        const friendList = connections.map((data)=>{
            if(data.fromUserId._id.equals(loggedInUser._id)){
                return data.toUserId;
            }
            return data.fromUserId;
        })
        res.json({
            message:"Friend List fetched",
            data:friendList
        })
    } catch (error) {
        
    }
})

// To fetch the feed of user
userRouter.get("/user/feed",userAuth,async (req,res)=>{
    try {
        const limit = req.query.limit || 2;
        const page = req.query.page||1;
        const skip = (page-1)*limit;
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        const hideConnectionsFromFeed = new Set();
        connections.forEach((item=>{
            hideConnectionsFromFeed.add(item.fromUserId.toString());
            hideConnectionsFromFeed.add(item.toUserId.toString());
        }))
        hideConnectionsFromFeed.add(loggedInUser._id.toString());
        const feedData = await User.find({
            _id:{$nin: Array.from(hideConnectionsFromFeed)}
        }).skip(skip).limit(limit);
        res.send(feedData);
    } catch (error) {
        res.status(500).send("Error: "+error.message)
    }
})

module.exports ={
    userRouter
}
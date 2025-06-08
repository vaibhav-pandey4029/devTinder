const express = require("express");
const { userAuth } = require("../middleware/auth");
const { User } = require("../model/user");
const {ConnectionRequestModel} = require("../model/requests");
const  requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
    try {
        const toUserId = req.params.toUserId;
    const status = req.params.status;
    const fromUserId = req.user._id;

    //Authenticated user--> done by middleware
    //status and id should be valid
    const ALLOWED_STATUS = ["ignored","interested"];
    const isValidStatus = ALLOWED_STATUS.includes(status);
    const toUser = await User.findById(toUserId);
    if(!isValidStatus){
        return res.status(400).send({
            message:"status is not valid"
        })
    }
    if(!toUser){
        return res.status(400).send({
            message:"Can not sent request to user"
        })
    }
    //id a to b or b to a request sent then a nd b should not be able to sent request
    const connectionRequests = await ConnectionRequestModel.find({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if(connectionRequests.length!==0){
        return res.status(400).send("Request already sent");
    }
    //a should not be able to sent request to self account--> defined pre method in connection schema
    const newRequestData = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status
    })
    await newRequestData.save();
    res.send({
        message:"Request Sent Successfully",
        data:newRequestData
    })
    } catch (error) {
        res.status(500).send("Error: "+error.message)
    }
})

module.exports ={
    requestRouter
}
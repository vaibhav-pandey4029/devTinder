const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type: String,
        required:true,
        enum:{
            values:["accepted","rejected","ignored","interested"],
            message:'{VALUE} is not a valid status'
        }
    }
},{
    timestamps: true
})

connectionRequestSchema.pre("save", function(next){
    const requestObject = this;
    if(requestObject.toUserId.equals(requestObject.fromUserId)){
        throw new Error("You can not sent request to yourself")
    }
    next();
})

const ConnectionRequestModel = new mongoose.model('connectionRequest',connectionRequestSchema);
module.exports = {
    ConnectionRequestModel
}
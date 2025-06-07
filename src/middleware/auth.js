const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

const userAuth = async (req,res,next)=>{
    const cookie = req.cookies;
    const {token} = cookie;
    if(!token){
        res.status(401).send("Token is invalid");
    }
    const decodedToken = jwt.verify(token,"Vaibhav@92346je");
    const {_id} = decodedToken;
    const user = await User.findById(_id);
    if(!user){
        res.status.send("User not found");
    }
    req.user=user;
    next();
}

module.exports={
    userAuth,
}
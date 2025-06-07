const express = require("express");
const bcrypt = require("bcrypt");
const {connectDB} = require("./config/database");
const {User} = require("./model/user")
const {validateSignUpData} = require("./utils/validators");
const app = express();
//This is the middleware we are adding to parse the JSON received from API request.body to JS Object so that it can be readed successfully beacuse if we will not add this them req.body will be undefined this middleware will be called each time when any route will get hit by users as we did not provided any path to it.
app.use(express.json());

//API to fetch the single user by emailId
app.get("/user",async (req,res)=>{
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
app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted");
    } catch (error) {
        res.status(500).send("Error in deleting the user"+error.message);
    }
})

//Update API 
app.patch("/user/:userId", async (req,res)=>{
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
app.get("/feed", async (req,res)=>{
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

//Signup API
app.post("/signup",async (req,res)=>{
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

connectDB().then(()=>{
    console.log("Database connected...");
    app.listen(3000,()=>{
        console.log("Server is listening on port 3000");
    })
}).catch((err)=>{
    console.error("Error while connecting to database...");
});
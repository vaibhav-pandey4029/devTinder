const express = require("express");
const {connectDB} = require("./config/database");
const {User} = require("./model/user")
const app = express();

app.post("/signup",async (req,res)=>{
    // Create a dummy data object
    const userObj = {
        firstName:"Vaibhav",
        lastName:"Pandey",
        emailId:"vaibhav@gmail.com",
        password:"12345"
    }

    try{
        // create a new instance of user model using the object
        const newUser = new User(userObj);
        await newUser.save();
        res.send("User added successfully")
    }catch(error){
        res.status(400).send("Error while creating user",error);
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
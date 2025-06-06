const express = require("express");
const {connectDB} = require("./config/database");
const {User} = require("./model/user")
const app = express();

//This is the middleware we are adding to parse the JSON received from API request.body to JS Object so that it can be readed successfully beacuse if we will not add this them req.body will be undefined this middleware will be called each time when any route will get hit by users as we did not provided any path to it.
app.use(express.json());

app.post("/signup",async (req,res)=>{
    // Create a dummy data object
    // const userObj = {
    //     firstName:"Vaibhav",
    //     lastName:"Pandey",
    //     emailId:"vaibhav@gmail.com",
    //     password:"12345"
    // }
    
    // create a new instance of user model using the object now it is dynamic
    const newUser = new User(req.body);
    try{
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
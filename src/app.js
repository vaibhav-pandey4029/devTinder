const express = require("express");
const {connectDB} = require("./config/database");

const cookieParser = require("cookie-parser");
const {authRouter} = require("./router/authRouter")
const {profileRouter} = require("./router/profileRouter")
const {userRouter} = require("./router/userRouter")
const {requestRouter} = require("./router/requestRouter")
const app = express();

//This is the middleware we are adding to parse the JSON received from API request.body to JS Object so that it can be readed successfully beacuse if we will not add this them req.body will be undefined this middleware will be called each time when any route will get hit by users as we did not provided any path to it.
app.use(express.json());

//This middleware is added to be called so that all route which are reading cookie can read it succesfully as without this middleware it will be undefined.
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",userRouter)
app.use("/",requestRouter)



connectDB().then(()=>{
    console.log("Database connected...");
    app.listen(3000,()=>{
        console.log("Server is listening on port 3000");
    })
}).catch((err)=>{
    console.error("Error while connecting to database...");
});
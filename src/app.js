const express = require("express");
const {connectDB} = require("./config/database");

const app = express();

connectDB().then(()=>{
    console.log("Database connected...");
    app.listen(()=>{
        console.log("Server is listening on port 3000");
    })
}).catch((err)=>{
    console.error("Error while connecting to database...");
});
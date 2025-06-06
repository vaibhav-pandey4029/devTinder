const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Vaibhav:6377314529@devtindercluster.sotkaiu.mongodb.net/DevTinder")
}

module.exports ={
    connectDB,
}

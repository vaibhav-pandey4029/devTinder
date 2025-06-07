const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName,lastname,emailId,password} = req.body;
    if(!firstName&&!lastname){
        throw new Error("Name is not valid");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password");
    }
}

module.exports={
    validateSignUpData
}
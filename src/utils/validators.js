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

const validateProfileEditData = (req)=>{
    const NOT_ALLOWED_Updates = ["emailId","password","userId"];
    const data = req.body;
    const isUpdateAllowed = Object.keys(data).every(
    key => !NOT_ALLOWED_Updates.includes(key)
);
    return isUpdateAllowed;
}

module.exports={
    validateSignUpData,
    validateProfileEditData
}
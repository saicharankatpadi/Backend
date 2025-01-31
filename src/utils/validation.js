const validator = require("validator");
const validationSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName ){
        throw new Error("first name is not valid");
    } 
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid!");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("please enter a strong password!");
    }
};
const validateEditProfileData = (req) =>{
    const allowedUpdates = ["photoUrl","about","firstName","lastName","skills","age"];
    const isUpadateAllowed = Object.keys(req.body).every((field) =>allowedUpdates.includes(field));
    return isUpadateAllowed;
};
module.exports = {
    validationSignUpData,
    validateEditProfileData,
};

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email"+ value);
            }
        },

    },
    age:{
        type:Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value){
            if(!['male', 'female' , 'others'].includes(value)){
                throw new Error("Gender not valid");
            }
        },
    },
    photoUrl:{
        type: String,
        default: "https://www.istockphoto.com/photos/human-dummy",

    },
    password:{
        type: String,
    },
    about:{
        type: String,
        default: "This is a default bio",
    },
    skills:{
        type: [String],
    },
},{
    timestamps: true,
});
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEVTinder$740",{
        expiresIn:"7d",
    });
    return token;
};
userSchema.methods.validatePassword = async function(inputPasswordByUser){
    user = this;
    passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(
        inputPasswordByUser,
        passwordHash
    );
    return isPasswordValid;

}
module.exports = mongoose.model("User", userSchema);
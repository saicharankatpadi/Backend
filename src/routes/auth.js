const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {validationSignUpData} = require("../utils/validation");


authRouter.post("/signup",async(req,res)=>{
  try{
        validationSignUpData(req);
        const {firstName , lastName , emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });
        const savedData = await user.save();
        const token = await savedData.getJWT();
        res.cookie("token",token,{
            expires: new Date(Date.now()+8 * 360000),
        });
       
        res.json({
            message:"siggnedup successfully",
            data:savedData
        });
    }catch(err){
        res.status(400).send("ERROR" + err.message);
    }
    
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if( isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token",token,{
                expires : new Date(Date.now() + 8 * 360000),
            });
            res.send(user);
        }
        else{
            
        throw new Error("Invalid Credentials");
        
        }
        
    }
    catch(err){
        res.status(400).send("ERROR"+err.message);
    }
});
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expire: new Date(Date.now()),
    }).send("logged out successfully");
})
module.exports = authRouter;
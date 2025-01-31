const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    const loggedInUser = req.user;
    const { newPassword }= req.body;

    try{
        if(!newPassword){
            throw new Error("Invalid Credentials");
        }
    const passwordChange = await bcrypt.hash(newPassword,10);
    const user = await User.findById(loggedInUser._id);
    if(!user){
        return res.status(400).json({
            message:"User not found",
        })
    }

     user.password = passwordChange;

     const data = await user.save();

     
     res.json({
        message:"password updated successfully",
        data
     });
    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
}
);

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const userProfile = req.user;
        res.send(userProfile);
    }catch(err){
        res.status(400).send("profile not found");
    }
});
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateEditProfileData){
              throw new Error("Invalid Edit Data");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({
            message:` ${loggedInUser.firstName} ,  'Your profile updatedSuccessfully`,
            data:loggedInUser,
        });
    }catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
});
module.exports = profileRouter;


//
//  $2b$10$nJJCCgExlqDYecrLpowd8.jX0r097tlHMTbeKkhAEqjecjwxmEGAS

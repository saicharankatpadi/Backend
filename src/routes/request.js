const express = require("express");
 const requestRouter = express.Router();
 const {userAuth} = require("../middlewares/auth");
 const connectionRequest = require("../models/connectionRequest");
 const User = require("../models/user");


 requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
         
       const allowedStatus = ["ignored","interested"];

       if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"INVALID STATUS TYPE",
        });
       }
       const userData = await User.findById(toUserId);
       if(!userData){
          throw new Error("user not found");
       }

       const existingConnection = await connectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId},
        ]
        
       });
       if(existingConnection){
        return res.status(400).send({
            message:"Already connection exists",
        });
       }
      const connectionData = new connectionRequest({
        fromUserId,
        toUserId,
        status
      });
      const data = await connectionData.save();
      
      res.json({
        message:req.user.firstName + status + userData.firstName ,
        data
      });
    }catch(err){
        res.status(400).send("ERROR!"+err.message);
    }
 });
 requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    const isAllowedStatus = ["accepted","rejected"];

    if(!isAllowedStatus.includes(status)){
      return res.status(400).json({
        message:"Invalid status type"
      });
    }
    
    const connectionRequests = await connectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested",
    });
    if(!connectionRequests){
      return res.status(400).json({
        message:"connection requests not found"
      });
    }
    connectionRequests.status = status;
    const data = await connectionRequests.save();
    console.log(data);
    res.json({
      message:"conncetion request:" + status,
      data :data,
    });
  }catch(err){
    res.status(400).send("ERROR!");
  }
 });
 module.exports = requestRouter;
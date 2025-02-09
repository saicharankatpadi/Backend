const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about";
const User = require("../models/user");
 userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId","firstName lastName photoUrl age gender about");
      
        res.json({
            message:"connection requests pending",
            data:connectionRequests
        });

    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
 });
 userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ],
        }).populate("fromUserId",USER_SAFE_DATA)
           .populate("toUserId",USER_SAFE_DATA);
     const data = connectionRequests.map((row)=>{
        if( row.fromUserId._id.toString() === loggedInUser._id.toString()){
             return row.toUserId;
        }
          return row.fromUserId;
     });
      res.json({
        data
      });

    }catch(err){
        res.status(400).send("ERROR")
    }
 });

 userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        let limit  = parseInt(req.query.limit) || 30;
        limit = limit>50 ? 50 :limit;
        const skip = (page-1)*limit;
        const loggedInUser = req.user;
        const existingConnections = await connectionRequest.find({
           $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id},
           ],
        }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set(); // a new array
     existingConnections.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });
    const data = await User.find({
        $and:[
            {_id :{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
        ],
    }).select(USER_SAFE_DATA)
       .skip(skip)
       .limit(limit);
      res.json({
        data
      });
    }catch(err){
        res.status(400).send("ERROR!!");
    }
 });

 module.exports = userRouter;
const mongoose = require("mongoose");
const User = require("../models/user");
 const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : User,
        required: true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : User,
    },
    status:{
        type : String,
        required: true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{value} is incorrect status type`,
           
        },
    },
 },{
    timestamps : true,
 });
 connectionRequestSchema.index({fromUserId:1, toUserId:1});
  connectionRequestSchema.pre("save",function(next){
       const connectionUser = this;
       if(connectionUser.fromUserId.equals(connectionUser.toUserId)){
        throw new Error("cannot send connection request");
       }
     next() ;
  })
  const ConnectionRequestModel = new mongoose.model("nnectionRequestModel",connectionRequestSchema);
  
  module.exports = ConnectionRequestModel;
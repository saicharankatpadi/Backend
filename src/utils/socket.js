const socket = require("socket.io");
const intializeSocket = (server)=>{
    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection",(socket)=>{
          socket.on("joinchat",({firstName,userId,targetUserId})=>{
            const roomId = [userId,targetUserId].sort().join("_");
            console.log(firstName+"joining room "+roomId);
          });
          socket.on("sendMessage",()=>{});
          socket.on("disconnect",()=>{});
    });
};
module.exports = intializeSocket;
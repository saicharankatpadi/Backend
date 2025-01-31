const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://saicharan:12204067@sainode.ljv6y.mongodb.net/devTinder"
    );
};
module.exports = connectDB;
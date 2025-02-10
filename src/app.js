const express = require('express');
const bcrypt = require('bcrypt');
const connectDB = require("./config/database");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const { userAuth } = require("./middlewares/auth");
const { validationSignUpData } = require("./utils/validation");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/users");
const cors = require("cors");

app.use(cors({
   origin:"http://localhost:5173",
   credentials:true,
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());  
app.use(cookieParser());
app.get('/api/', (req, res) => {
   res.send('API is working!');
});


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB()
     .then(() =>{
        console.log("Database connected successfully!");
        app.listen(7777,()=>{
            console.log("server listening on port 7777");
        });
        
     }).catch((err) =>{
        console.error("Database not been connected successfully!");
     });

 



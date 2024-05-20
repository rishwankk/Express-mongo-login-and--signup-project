    const express= require("express")
const path=require("path")
const session=require("express-session")
const  fs=require("fs"); 
const collection=require("./mongo")
const userRouter=require('./routers/userRouter')
const adminRouter=require("./routers/adminRoute")
// const mongoose=require("mongoose")

const app=express();
const port=process.env.PORT||3000;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));  





app.set("view engine","ejs")
app.set("views","views")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin",adminRouter)
app.use("/",userRouter)




app.listen(port,()=>{
    console.log("server running");
})


module.exports=app
const express=require("express");
const cors = require("cors");
const dotenv=require("dotenv").config();
const app=express();
const db=require('./models');
const port=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//routes 
const authRoute=require('./routes/authRoutes');
app.use("/auth",authRoute);
const userRoute=require('./routes/UserRoutes');
app.use("/users", userRoute);
const billRoute=require('./routes/billRoutes');
app.use("/bills", billRoute);
app.use("/reminders",require('./routes/reminderRoutes'));
app.use("/reports",require('./routes/reportRoutes'));
const startOverdue=require("./jobs/overdue");
const startReminderJob=require("./jobs/reminderJob");
const ocrRoute=require("./routes/ocrRoutes");
app.use("/ocr",ocrRoute);
app.use("/uploads",express.static("uploads"));
try{
console.log("Registering settings route...");;
const settingsRoute=require("./routes/settingsRoutes");
app.use("/settings",settingsRoute);
}catch(err){
    console.error("SETTINGS ROUTE ERROR",err.message);
}

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({error:"Something went wrong"});
});

db.sequelize.sync({alter:true}).then(()=>{ //to update automatically
 app.listen(port, ()=>{
    console.log(`server running on ${port}`);
});
    startOverdue();
    startReminderJob();
});
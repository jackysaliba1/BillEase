const {Reminder,Bills}=require("../models");
 const getReminders=async(req,res) =>{
    try{
        const reminders=await Reminder.findAll({
            where:{ userId:req.user.id },
            include:[{
                model:Bills,
                attributes:["Description","dueDate","Status","Category"],
            }],
            order:[["reminderDate", "ASC"]],
    
        });
        res.json(reminders);
    }catch(err){
        res.status(500).json({error:err.message});
    }
 };
 const createReminder=async(req,res)=>{
    try{
        const {billId,reminderDate,reminderType}= req.body;
        if(!billId ||!reminderDate)
        return res.status(400).json({error:"billId and reminderDate are required"});
          const bill= await Bills.findOne({where:{id:billId, userId: req.user.id}});
          if(!bill) return res.status(404).json({error:"Bill not found"});
        
        const reminder=await Reminder.create({
            billId,
            userId:req.user.id,
            reminderDate,
            reminderType:reminderType || "email",
            isSent:false,
        });
        res.status(201).json(reminder);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
 };
 const deleteReminder=async(req,res)=>{
    try{
        const reminder=await Reminder.findOne({
            where:{id:req.params.id, userId:req.user.id},
        });
        if(!reminder) return res.status(404).json({error:"Reminder not found"});
        await reminder.destroy();
        res.json({message:"Reminder deleted successfully"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
    };
 module.exports={getReminders, createReminder, deleteReminder};

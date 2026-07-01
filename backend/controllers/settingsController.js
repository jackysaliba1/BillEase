const{ UserSettings}=require("../models");

const getSettings=async(req,res) =>{
    try{
        const[settings]=await UserSettings.findOrCreate({
            where:{userId:req.user.id},
            defaults:{
                reminderDaysBefore:3,
                notificationType:"email",
                emailNotifications:true,
                inAppNotifications:false,
            },
        });
        res.json(settings);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};


const updateSettings=async(req,res) =>{
    try{
        const{reminderDaysBefore,notificationType,emailNotifications,inAppNotifications}=req.body;
        const[settings]=await UserSettings.findOrCreate({
            where:{userId:req.user.id},
            defaults:{
                reminderDaysBefore:3,
                notificationType:"email",
                emailNotifications:true,
                inAppNotifications:false,
            },
        });
        await settings.update({
            ...(reminderDaysBefore !==undefined &&{reminderDaysBefore}),
            ...(notificationType !==undefined &&{notificationType}),
            ...(emailNotifications !==undefined &&{emailNotifications}),
            ...(inAppNotifications !==undefined &&{inAppNotifications}),
        });
        res.json({message:"Settings updated successfully",settings});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};
module.exports={getSettings,updateSettings};

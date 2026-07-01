const cron=require("node-cron");
const{Bills,Op}=require("../models");
const {Sequelize}=require("../models");
const startOverdue=()=>{
    cron.schedule("0 0 * * *",async() => {
        try{
            const today=new Date().toISOString().split("T")[0];
            const updated=await Bills.update(
                {Status:"overdue"},
                {
                    where:{
                        Status:"pending",
                        dueDate:{[Sequelize.Op.lt]:today},
                    },
                }
            );
            console.log(`[OverdueJob] ${updated} bills(s) marked as overdue`);
        } catch(err){
            console.error("[OverdueJob] Error:",err.message);
        }
    });
    console.log("[OverdueJob] Scheduler started");
};
module.exports=startOverdue;
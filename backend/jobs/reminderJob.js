const cron=require("node-cron");
const nodemailer=require("nodemailer");
const {Reminder,Bills,User,UserSettings}= require("../models");
const {Sequelize }=require("../models");

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

const startReminderJob =() =>{
    cron.schedule("0 * * * *",async () =>{
        try{
            const now=new Date();
            const oneHourLater=new Date(now.getTime()+60 *60 *1000);
            
            const reminders=await Reminder.findAll({
                where:{
                    isSent:false,
                    reminderDate:{
                        [Sequelize.Op.between]:[now,oneHourLater],
                    },
                },
                include:[
                    {model:Bills,attributes:["Description","dueDate","amount","Category"]},
                    {model:User,attributes:["name","email"]},
                ],
            });
            for(const reminder of reminders){
                const user=reminder.User;
                const bill=reminder.Bills;
                if(!user || !bill) continue;

                const settings=user.UserSettings;
                const sendEmail=settings ? settings.emailNotifications:true;
                const notifyType=settings? settings.notificationType:"email";

                if(sendEmail && (notifyType ==="email" || notifyType==="both")){
                    await transporter.sendMail({
                        from:`"BillEase" <${process.env.EMAIL_USER}>`,
                        to:user.email,
                        subject:`Reminder: ${bill.Description} due soon`,
                        html:`                       
                        <h2> Hi ${user.name},</h2>
                        <p> This is a reminder that your bill is due soon.</p>
                        <ul>
                            <li> <strong>Bill:</strong>${bill.Description}</li>
                            <li> <strong>Category:</strong>${bill.Category}</li>
                            <li> <strong>Amount:</strong>${bill.amount}</li>
                            <li> <strong>Due Date:</strong>${bill.dueDate}</li>
                        </ul>
                        <p>Log in to BillEase to mark it as paid.</p>
                        `,
                    });
                }
                await reminder.update({isSent:true});
                console.log(`[ReminderJob] Reminder sent to${user.email} for bill: ${bill.Description}`);
            }
        }catch(err){
            console.error("[ReminderJob] Error:", err.message);
        }
    });
    console.log("[ReminderJob]  Scheduler started");
};
module.exports=startReminderJob;

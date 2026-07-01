const {Bills,Sequelize} =require("../models");
const getDashboardStat= async(req,res)=>{
    try{
        const userId=req.user.id;
        const Op=Sequelize.Op;
        const totals=await Bills.findOne({
            where: {userId},
            attributes:[
                [Sequelize.fn("COUNT",Sequelize.col("id")), "totalBills"],
                [Sequelize.fn("SUM",Sequelize.col("amount")), "totalAmount"]
            ],
            raw:true,
        });
        const byStatus = await Bills.findAll({
            where:{userId},
            attributes:[
                "Status",
                [Sequelize.fn("COUNT",Sequelize.col("id")), "count"],
            ],
            group:["Status"],
            raw:true,
        });
        const byCategory=await Bills.findAll({
            where:{userId},
            attributes:[
                "Category",
                [Sequelize.fn("COUNT",Sequelize.col("id")), "count"],
                [Sequelize.fn("SUM",Sequelize.col("amount")), "totalAmount"],
            ],
            group:["Category"],
            raw:true,
        });
        const today= new Date();
        const nextWeek=new Date();
        nextWeek.setDate(today.getDate()+7);

        const upcoming=await Bills.findAll({
            where:{
                userId,
                Status:"pending",
                dueDate:{
                    [Op.between]:[
                        today.toISOString().split("T")[0],
                        nextWeek.toISOString().split("T")[0],
                    ],
                },
            },
            order:[["dueDate","ASC"]],
        });
        res.json({totals,byStatus,byCategory,upcoming});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};
const getMonthlyReport= async(req,res)=>{
    try{
        const userId=req.user.id;
        const Op=Sequelize.Op;
        const now=new Date();
        const targetMonth=parseInt(req.query.month) || now.getMonth() +1;
        const targetYear=parseInt(req.query.year) || now.getFullYear();

        const startDate=`${targetYear}-${String(targetMonth).padStart(2,"0")}-01`;
        const endDate= new Date(targetYear, targetMonth,0).toISOString().split("T")[0];

        const bills=await Bills.findAll({
            where:{
                userId,
                dueDate:{[Sequelize.Op.between]: [startDate,endDate]},
            },
            order:[["dueDate","ASC"]],
        });
        const total = bills.reduce((s,b)=>s+parseFloat(b.amount),0);
        const paid= bills.filter(b=> b.Status ==="paid");
        const unpaid= bills.filter(b=> b.Status ==="pending");
        const overdue= bills.filter(b=> b.Status ==="overdue");
        const paidAmount=paid.reduce((s,b)=> s+parseFloat(b.amount),0);
        const unpaidAmount = [...unpaid, ...overdue].reduce((s,b)=> s+parseFloat(b.amount),0);

        const byCategory={};
        bills.forEach(b=> {
            if(!byCategory[b.Category])
                byCategory[b.Category]={count:0, total:0};
            byCategory[b.Category].count++;
            byCategory[b.Category].total += parseFloat(b.amount);
        });
        
        res.json({
            period:{month:targetMonth , year:targetYear, startDate , endDate},
            summary:{
                totalBills: bills.length,
                totalAmount:total.toFixed(2),
                paidCount:paid.length,
                paidAmount:paidAmount.toFixed(2),
                unpaidCount:unpaid.length+ overdue.length,
                unpaidAmount:unpaidAmount.toFixed(2),
                overdueCount:overdue.length,
            },
            byCategory,
            bills,
        });
    } catch(err){
        res.status(500).json({error:err.message});
    }
};

const getUnpaidSummary=async(req,res)=>{
    try{
        const userId=req.user.id;
        const unpaidBills=await Bills.findAll({
            where:{
                userId,
                Status:{[Sequelize.Op.in]: ["pending","overdue"]},
            },
            order:[["dueDate","ASC"]],
        });

        const totalUnpaid=unpaidBills.reduce((sum,bill)=>sum+parseFloat(bill.amount),0).toFixed(2);

        const overdueOnly=unpaidBills.filter(b=>b.Status === "overdue");
        const totalOverdue=overdueOnly.reduce((sum,bill)=>sum +parseFloat(bill.amount),0).toFixed(2);

        res.json({
            totalUnpaidCount:unpaidBills.length,
            totalUnpaidAmount:totalUnpaid,
            overdueCount:overdueOnly.length,
            totalOverdueAmount:totalOverdue,
            bills:unpaidBills,
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports={ getDashboardStat , getMonthlyReport,getUnpaidSummary};
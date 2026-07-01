const{Bills}=require("../models");
const getBills=async(req,res) =>{
    try{
        const bills=await Bills.findAll({where:{userId:req.user.id}});
        res.json(bills);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
const createBill=async(req,res)=>{
    try{
        const {amount,dueDate,Description,Category}=req.body;
        const today=new Date();
        today.setHours(0,0,0,0);
        const due=new Date(dueDate);
        due.setHours(0,0,0,0);
        const Status=due<today ? "overdue" :"pending" ;
        const bill=await Bills.create({
            amount,
            dueDate,
            Description,
            Category,
            Status,
            userId:req.user.id,
        });
        res.status(201).json(bill);
    }
        catch(err){
            console.error("FULL ERROR",err);
            res.status(500).json({error:err.message});
        }
    };
const getBillById=async(req,res) =>{
    try{
        const bill=await Bills.findOne({where:{id:req.params.id,userId:req.user.id}});
        if(!bill) return res.status(404).json({error:"Bill not found"});
        res.json(bill);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
const updateBill=async(req,res)=>{
    try{
        const bill=await Bills.findOne({where:{id:req.params.id, userId:req.user.id}});
        if(!bill)return res.status(404).json({error:"Bill not found"});
        await bill.update(req.body);
        res.json(bill);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
const deleteBill=async(req,res) =>{
    try{
        const bill=await Bills.findOne({where:{id:req.params.id,userId:req.user.id}});
        if(!bill)return res.status(404).json({error:"Bill not found"});
        await bill.destroy();
        res.json({message:"Bill deleted successfully"});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

const markAsPaid= async(req,res)=>{
    try{
        const bill=await Bills.findOne({where:{id:req.params.id, userId:req.user.id}});
        if(!bill) return res.status(404).json({error:"Bill not found"});
        if(bill.Status=="paid")
            return res.status(404).json({error:"Bill is already marked as paid"});
        await bill.update({Status:"paid"});
        res.json({message:"Bill marked as paid",bill});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};
module.exports={getBills,createBill,getBillById,updateBill,deleteBill,markAsPaid};
const express=require('express');
const router=express.Router();
const bcrypt=require("bcryptjs");
const verifyToken=require("../middlewares/authMiddleware");
const {User}=require("../models");
router.get("/me",verifyToken,async(req,res)=>{
    try{
        const user=await User.findByPk(req.user.id,{
            attributes:{exclude:["password"]},
        });
        if(!user) return res.status(404).json({error:"User not found"});
        res.json(user);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
});
router.put("/me",verifyToken,async(req,res)=>{
     try{
        const user=await User.findByPk(req.user.id);
        if(!user) return res.status(404).json({error:"User not found"});
            const{name,email}=req.body;
            await user.update({name,email});
            res.json({id:user.id,name:user.name,email:user.email});
     }catch(err){
        res.status(500).json({error:err.message});
     }
    });

router.put("/me/password",verifyToken,async(req,res)=>{
    try{
        const{currentPassword,newPassword}=req.body;
        if(!currentPassword || !newPassword)
            return res.status(400).json({error:"Both passwords are required"});
        const user=await User.findByPk(req.user.id); //find primarykey 
        const isMatch=await bcrypt.compare(currentPassword,user.password);
        if(!isMatch)
            return res.status(401).json({error:"Current password is incorrect"});

        const hashed=await bcrypt.hash(newPassword,10);
        await user.update({password:hashed});
        res.json({message:"Password updated successfully"});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
});
module.exports=router;
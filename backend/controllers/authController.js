const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {User}=require("../models");

const register=async(req,res) =>{
    try{
        const{name,email,password}=req.body;
        //now we're checking if the user already exists
        const existing=await User.findOne({where:{email}});
        if(existing){
            return res.status(400).json({error:"This email is already registered"});
        }
        //now we're hashing the password to secure
        const HashedPass=await bcrypt.hash(password,10); 
        const user=await User.create({name,email,password:HashedPass});
        res.status(201).json({message:"User registered successfully!",userId:user.id})
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({where:{email}});
        if(!user) return res.status(404).json({error:"User not found"});

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(401).json({error:"Invalid Password"});
        const token=jwt.sign(
            {id:user.id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        res.json({message:"Login successful",token,user:{id:user.id,name:user.name,email:user.email}});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};
module.exports={register,login};
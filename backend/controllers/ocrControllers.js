const Tesseract=require("tesseract.js");
const path=require("path");
const fs=require("fs");

const uploadAndExtract=async(req,res) =>{
    try{
        if(!req.file) return res.status(400).json({error:"No image uploaded"});
        const imagePath=req.file.path;

        const{data: {text} }=await Tesseract.recognize(imagePath,"eng",{
            logger :(m) =>console.log("[OCR]",m.status),

        });
        const extracted=parseOCRText(text);
        fs.unlinkSync(imagePath);

        res.json({
            rawText:text,
            extracted,
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

const parseOCRText= (text)=>{
    const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
//we're looking for the amount as a number that matches this format:45.00 or $45.00
    const amountMatch=text.match(/\$?\s*(\d+[\.,]\d{2})/);
    const amount=amountMatch ? parseFloat(amountMatch[1].replace(",", ".")): null;

//now for the date format
const dateMatch=text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2})/);
let dueDate=null;
if(dateMatch){
        const parsed=new Date(dateMatch[0]);
        if(!isNaN(parsed)) dueDate=parsed.toISOString().split("T")[0];
    }
const Description=lines[0] || null;

//we're trying to guess the category through keywords from the text
const lower=text.toLowerCase();
let Category = null;

if (lower.includes("electric") || lower.includes("power") || lower.includes("kwh"))
    Category= "electricity";
else if (lower.includes("water") || lower.includes("sewage"))
    Category = "water";
else if (lower.includes("rent") || lower.includes("lease"))
    Category = "rent";
else if (lower.includes("phone") || lower.includes("mobile") || lower.includes("telecom"))
    Category = "phone";
else if (lower.includes("netflix") || lower.includes("subscription") || lower.includes("spotify"))
    Category = "subscription";

return { amount, dueDate, Description, Category };
};
module.exports={uploadAndExtract};
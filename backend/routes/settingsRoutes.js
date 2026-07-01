const express=require("express");
const router=express.Router();
const verifyToken=require("../middlewares/authMiddleware");
const {getSettings, updateSettings}=require("../controllers/settingsController");

router.use(verifyToken);
router.get("/",getSettings);
router.put("/",updateSettings);

module.exports=router;
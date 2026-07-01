const express=require("express");
const router=express.Router();
const verifyToken=require("../middlewares/authMiddleware");
const{getReminders,createReminder,deleteReminder }=require("../controllers/reminderController");

router.use(verifyToken);
router.get("/", getReminders);
router.post("/", createReminder);
router.delete("/:id", deleteReminder);
module.exports=router;

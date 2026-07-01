const express=require("express");
const router=express.Router();
const verifyToken=require("../middlewares/authMiddleware");
const { getDashboardStat , getMonthlyReport ,getUnpaidSummary } = require("../controllers/reportController");

router.get("/dashboard", verifyToken, getDashboardStat);
router.get("/monthly" , verifyToken, getMonthlyReport);
router.get("/unpaid", verifyToken ,getUnpaidSummary);
module.exports= router;

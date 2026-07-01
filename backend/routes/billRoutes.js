const express=require("express");
const router=express.Router();
const verifyToken=require("../middlewares/authMiddleware");
const{getBills,createBill,getBillById,updateBill,deleteBill, markAsPaid}=require("../controllers/billControllers");
router.use(verifyToken); //to do these operations user need to be registered or log in

router.get('/',getBills);
router.post('/',createBill);
router.patch('/:id/pay',markAsPaid);
router.get('/:id',getBillById);
router.put('/:id',updateBill);
router.delete('/:id',deleteBill);
module.exports=router;
  
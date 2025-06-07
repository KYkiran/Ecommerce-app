import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const userId = req.user._id; 
        const coupon = await Coupon.findOne({userId:userId,isActive:true});
        res.json(coupon || null)
    } catch (error) {
        console.error("Error fetching coupon:", error);
        res.status(500).json({ message: "Internal server error",error: error.message });        
    }
}

export const validateCoupon = async (req,res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code:code, userId:req.user._id, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found or inactive" });
        }
        if(new Date() > coupon.expirationDate) {
            coupon.isActive = false; // Mark the coupon as inactive if expired
            await coupon.save(); // Save the updated coupon status
            return res.status(404).json({ message: "Coupon has expired" });
        }
        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        })
    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).json({ message: "Internal server error",error: error.message });        
    }
}
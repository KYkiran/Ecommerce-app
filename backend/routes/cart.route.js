import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getCart,addToCart,deleteCart,updateQuantity } from "../controllers/cart.controller.js";

const router = Router();

router.get('/',protectRoute,getCart);
router.post('/',protectRoute,addToCart);
router.delete('/',protectRoute,deleteCart);
router.put('/:id',protectRoute,updateQuantity);

export default router;
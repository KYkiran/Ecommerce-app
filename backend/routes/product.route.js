import express from "express";
import { getAllProducts,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getProductByCategory,
    toggleFeatureProduct,
    getReccomendedProducts
 } from "../controllers/product.controller.js";
import { protectRoute,adminRoute } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductByCategory);
router.get("/recommendations",getReccomendedProducts);
router.post("/",protectRoute,adminRoute,createProduct);
router.patch("/:id",protectRoute,adminRoute,toggleFeatureProduct);
router.delete("/:id",protectRoute,adminRoute,deleteProduct);


export default router;
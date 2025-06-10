import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req,res)=>{
    try {
        const products = await Product.find({});

        res.json({products});
    } catch (error) {
        console.error("Error in getAllProducts Route",error);
        res.status(500).json({message:"Internal Server Error",error:error});
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({ isFeatured: true }).lean();
        
        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // Cache the results in Redis with expiration (optional)
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // Cache for 1 hour

        // FIXED: Return the products directly, not wrapped in an object
        res.json(featuredProducts);
    } catch (error) {
        console.error("Error in getFeaturedProducts Route:", error);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

export const createProduct = async (req,res)=>{
    try {
        const {name,description,price,image,category} = req.body;
        
        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"});
        }
        const product = await Product.create({
            name,
            description,
            price,
            image:cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url:"",
            category
        })
        res.status(201).json({product});
    } catch (error) {
        console.error("Error in createProduct Route",error);
        res.status(500).json({message:"Internal server error",error:error});
    }
}

export const deleteProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Deleted image from cloudinary");                
            } catch (error) {
                console.error("Error deleting image from cloudinary",error);                
            }
        }
        await Product.findByIdAndDelete(req.params.id);

        res.json("Product deleted successfully");
    } catch (error) {
        console.error("Error in deleteProduct controller",error);
        res.status(500).json({message:"Internal server error",error:error});
    }
}

export const getProductByCategory = async (req,res) =>{
    try {
        const {category} = req.params;
        const products = await Product.find({category:category});
        if(!products){
            return res.status(404).json({message:"No products found in this category"});
        }
        res.status(200).json({products});
    } catch (error) {
        console.error("Error in getProductByCategory controller",error);
        res.status(500).json({message:"Internal server error",error:error})
    }
}

export const getReccomendedProducts = async (req,res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    price:1,
                    image:1,
                    description:1
                }
            }
        ]);
        res.json({products});
    } catch (error) {
        console.error("Error in getReccomendedProducts Route",error);
        res.status(500).json({message:"Internal server error",error:error});
    }
}

export const toggleFeatureProduct = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updateProduct = await product.save();
            await updateFeaturedProductCache();
            res.json(updateProduct);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    } catch (error) {
        console.error("Error in toggleFeaturedProduct Route",error);
        res.status(500).json({message:"Internal server error",error:error});
    }
}

async function updateFeaturedProductCache() {
    try {
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await redis.set("featured_product",JSON.stringify(featuredProducts));
    } catch (error) {
        console.error("Error in updatedFeaturedProductCache function",error);
    }
}
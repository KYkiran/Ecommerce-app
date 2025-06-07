import express, { urlencoded } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import connectMongoDB from "./lib/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = 5000 | process.env.PORT;


app.use(express.json())
app.use(cookieParser());

app.use(urlencoded({extended:true}));
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupons',couponRoutes);
app.use('/api/payment',paymentRoutes)

app.listen(PORT,()=>{
    console.log(`Server is Running on port:${PORT}`);
    connectMongoDB();
})
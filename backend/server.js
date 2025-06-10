import express, { urlencoded } from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import connectMongoDB from "./lib/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

// Auto-detect production on Render (Render sets this automatically)
if (process.env.RENDER || process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'production';
}

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

app.use(express.json({limit:"5mb"}))
app.use(cookieParser());
app.use(urlencoded({extended:true}));

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupons',couponRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/analytics',analyticsRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "frontend/dist")));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT,()=>{
    console.log(`Server is Running on port:${PORT}`);
    connectMongoDB();
})
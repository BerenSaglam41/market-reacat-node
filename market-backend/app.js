import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ProductRouter from "./routes/ProductRoutes.js";
import AdminRouter from "./routes/AdminRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import CartRouter from "./routes/CartRoutes.js";
import OrderRouter from "./routes/OrderRoutes.js";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 5000;

console.log('🚀 Starting Express 4.x server...');
console.log('🔗 PORT:', port);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Connect to database first
await connectDB();

// CORS Configuration - Simple and compatible
const corsOptions = {
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply middlewares in correct order
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Market Backend API is running! 🚀',
    version: 'Express 4.x + Clean Setup',
    routes: {
      products: '/api/products',
      users: '/user',
      cart: '/api/cart',
      orders: '/order',
      admin: '/admin'
    },
    status: 'Backend çalışıyor ve veritabanı bağlı!'
  });
});

// API Routes
app.use('/order', OrderRouter);
app.use("/api/products", ProductRouter);
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);
app.use('/api/cart', CartRouter);

// 404 Handler
app.use((req, res, next) => {
  const error = new Error("Route not found.");
  error.status = 404;
  next(error); 
});

// Error Handler
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  
  console.error('Error:', error);
  
  res.status(status).json({ 
    success: false,
    message, 
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Express 4.x server running on port: ${port}`);
  console.log(`🌍 API URL: https://market-reacat-node-production.up.railway.app`);
  console.log('✅ CORS enabled for all origins');
});

export default app;

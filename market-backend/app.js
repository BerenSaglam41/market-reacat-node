import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import ProductRouter from "./routes/ProductRoutes.js";
import AdminRouter from "./routes/AdminRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import CartRouter from "./routes/CartRoutes.js";
import OrderRouter from "./routes/OrderRoutes.js";

const port = process.env.PORT || 5000;

console.log('🚀 Starting Express 4.x server...');
console.log('🔗 PORT:', port);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Connect to database
await connectDB();

// Simple CORS - Express 4.x compatible
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Basic middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Market Backend API is running! 🚀',
    version: 'Express 4.x',
    routes: {
      products: '/api/products',
      users: '/user',
      cart: '/api/cart',
      orders: '/order'
    },
    status: 'Running with manual CORS'
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
  res.status(status).json({ message, error: error.message });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Express 4.x server running on port: ${port}`);
  console.log(`🌍 API: https://market-reacat-node-production.up.railway.app`);
  console.log('✅ Manual CORS enabled');
});

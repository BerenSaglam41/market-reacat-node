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

// CORS Configuration - Cookie destekli
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins for cookies
    const allowedOrigins = [
      'https://market-reacat-node.vercel.app',
      'https://market-react-node.vercel.app', // Yeni Vercel domain
      'https://marketreactnode.vercel.app',   // Alternatif domain
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
      'http://localhost:4173', // Vite preview port
      'https://localhost:3000',
      'https://localhost:5173'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Development ortamında tüm localhost'lara izin ver
    if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('🚫 CORS Blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // 🔥 ÖNEMLİ - Cookie'ler için
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie',
    'Set-Cookie',
    'Access-Control-Allow-Credentials',
    'X-Requested-With'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply middlewares in correct order
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Market Backend API is running! 🚀',
    version: 'Express 4.x + Clean Setup',
    environment: process.env.NODE_ENV,
    routes: {
      products: '/api/products',
      users: '/user',
      cart: '/api/cart',
      orders: '/order',
      admin: '/admin'
    },
    status: 'Backend çalışıyor ve veritabanı bağlı!',
    cors: {
      allowedOrigins: [
        'https://market-reacat-node.vercel.app',
        'https://market-react-node.vercel.app',
        'https://marketreactnode.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173'
      ]
    }
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
  console.log('🚫 404 - Route not found:', req.method, req.originalUrl);
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
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

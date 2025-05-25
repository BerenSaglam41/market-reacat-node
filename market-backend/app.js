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

console.log('🚀 Starting server...');
console.log('🔗 FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Connect to database
await connectDB();

// CORS Configuration - EN ÖNCESİNDE OLMALI
const corsOptions = {
  origin: true, // TÜM ORIGIN'LERE İZİN - DEBUG İÇİN
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  optionsSuccessStatus: 200
};

// Apply CORS before other middlewares
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Other middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Market Backend API is running! 🚀',
    routes: {
      products: '/api/products',
      users: '/user',
      cart: '/api/cart',
      orders: '/order'
    },
    cors: 'Enabled for all origins',
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
  const details = error.details;
  const errors = error.errors;
  res.status(status).json({ message, details, errors });
});

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port: ${port}`);
  console.log(`🌍 Railway Domain: https://market-reacat-node-production.up.railway.app`);
  console.log(`📦 API Base URL: https://market-reacat-node-production.up.railway.app/api`);
  console.log('✅ CORS enabled for frontend');
});

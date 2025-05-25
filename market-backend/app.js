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

console.log('🚀 Port:', port);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔗 FRONTEND_URL:', process.env.FRONTEND_URL);

const app = express();

await connectDB();

const corsConfig = {
  origin: function (origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'https://localhost:3000',
      'https://market-reacat-node.vercel.app'
    ].filter(Boolean);
    
    console.log('📍 Request Origin:', origin);
    console.log('📝 Allowed Origins:', allowedOrigins);
    
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    console.log('❌ Origin blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 200
};

app.use(cookieParser());
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(express.static("public"));

// CORS is handled by cors middleware above

app.use('/uploads', express.static('uploads'));

// Handle preflight OPTIONS requests
app.options('*', cors(corsConfig));

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
    status: 'Backend çalışıyor ve veritabanı bağlı!'
  });
});

//ROUTES
app.use('/order',OrderRouter)
app.use("/api/products", ProductRouter);
app.use('/admin',AdminRouter);
app.use('/user',UserRouter)
app.use('/api/cart',CartRouter);

// Olmayan Yollar için
app.use((req, res, next) => {
  const error = new Error("Route not found.");
  error.status = 404;
  next(error); 
});

// HATA yakalama
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  const details = error.details;
  const errors = error.errors;
  res.status(status).json({ message, details, errors });
});

//SERVER
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port: ${port}`);
  console.log(`🌍 Railway Domain: https://market-reacat-node-production.up.railway.app`);
  console.log(`📦 API Base URL: https://market-reacat-node-production.up.railway.app/api`);
});

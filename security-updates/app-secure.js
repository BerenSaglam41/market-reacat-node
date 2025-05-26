import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
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
const isProduction = process.env.NODE_ENV === 'production';

console.log('🚀 Starting Secure Express server...');
console.log('🔗 PORT:', port);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Connect to database first
await connectDB();

// Security: Trust proxy (for Railway/Vercel)
app.set('trust proxy', 1);

// Security: Helmet for security headers
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            mediaSrc: ["'self'", "https:", "data:"],
        },
    },
}));

// Security: Rate limiting
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            console.log(`🚫 Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({
                error: message,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 dakika
    100, // 100 istek
    "Çok fazla istek. 15 dakika sonra tekrar deneyin."
);

const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 dakika
    5, // 5 deneme
    "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin."
);

const uploadLimiter = createRateLimiter(
    60 * 1000, // 1 dakika
    5, // 5 upload
    "Çok fazla dosya yükleme. 1 dakika sonra tekrar deneyin."
);

// Apply general rate limiting
app.use('/api/', generalLimiter);

// Security: CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://market-reacat-node.vercel.app',
      'https://market-react-node.vercel.app',
      'https://marketreactnode.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173'
    ];
    
    // Production'da sadece beyaz listedeki origin'lere izin ver
    if (isProduction && !allowedOrigins.includes(origin)) {
      console.log('🚫 CORS Blocked origin in production:', origin);
      return callback(new Error('CORS policy violation'), false);
    }
    
    // Development'ta tüm localhost'lara izin ver
    if (!isProduction && origin?.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('🚫 CORS Blocked origin:', origin);
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
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

// Security: Input sanitization
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.log(`🧹 Sanitized input: ${key} in ${req.url}`);
    },
}));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip}`);
    next();
});

// Apply middlewares in correct order
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    security: {
      helmet: 'enabled',
      rateLimit: 'enabled',
      mongoSanitize: 'enabled',
      cors: 'enabled'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Secure Market Backend API is running! 🔒🚀',
    version: 'Express 4.x + Security Enhanced',
    environment: process.env.NODE_ENV,
    security: {
      rateLimiting: 'Active',
      corsPolicy: 'Enforced',
      inputSanitization: 'Active',
      securityHeaders: 'Applied'
    },
    routes: {
      products: '/api/products',
      users: '/user',
      cart: '/api/cart',
      orders: '/order',
      admin: '/admin'
    },
    status: 'Backend güvenli şekilde çalışıyor!'
  });
});

// Apply specific rate limits to auth routes
app.use('/user/login', authLimiter);
app.use('/user/register', authLimiter);
app.use('/uploads', uploadLimiter);

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

// Security: Enhanced Error Handler
app.use((error, req, res, next) => {
  const status = error.status || 500;
  
  // Log security events
  if (status === 429) {
    console.log(`🚨 Rate limit exceeded: ${req.ip} - ${req.url}`);
  } else if (error.message.includes('CORS')) {
    console.log(`🚨 CORS violation: ${req.get('Origin')} - ${req.url}`);
  } else if (status >= 500) {
    console.error('🚨 Server error:', error);
  }
  
  // Rate limit error
  if (status === 429) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: error.message,
      retryAfter: error.retryAfter
    });
  }
  
  // CORS error
  if (error.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Policy Violation',
      message: 'Origin not allowed'
    });
  }
  
  // Validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message
    });
  }
  
  // JWT error
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Geçersiz token'
    });
  }
  
  // Production'da hassas bilgileri gizle
  const message = isProduction 
    ? 'Sunucu hatası oluştu' 
    : error.message;
  
  res.status(status).json({ 
    success: false,
    error: 'Internal Server Error',
    message,
    ...(isProduction ? {} : { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start Server
app.listen(port, () => {
  console.log(`🔒 Secure Express server running on port: ${port}`);
  console.log(`🌍 API URL: https://market-reacat-node-production.up.railway.app`);
  console.log('✅ Security features enabled:');
  console.log('   - Helmet security headers');
  console.log('   - Rate limiting');
  console.log('   - Input sanitization');
  console.log('   - CORS protection');
  console.log('   - Request logging');
});

export default app;
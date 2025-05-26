const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// Rate limiting middleware
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests") => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Farklı endpoint'ler için farklı limitler
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 dakika
    5, // 5 deneme
    "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin."
);

const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 dakika
    100, // 100 istek
    "Çok fazla istek. Lütfen daha sonra tekrar deneyin."
);

const uploadLimiter = createRateLimiter(
    60 * 1000, // 1 dakika
    5, // 5 upload
    "Çok fazla dosya yükleme. 1 dakika sonra tekrar deneyin."
);

// CORS ayarları
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://market-app-vercel.vercel.app',
            'https://market-reacat-node-production.up.railway.app'
        ];
        
        // Development'ta origin olmaması normal
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy violation'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Security headers
const helmetConfig = {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
    // MongoDB injection koruması
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.query);
    mongoSanitize.sanitize(req.params);
    
    next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip} - UA: ${userAgent}`);
    
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
    console.error(err.stack);
    
    // Rate limit hatası
    if (err.type === 'RateLimitError') {
        return res.status(429).json({
            error: 'Too many requests',
            message: err.message,
            retryAfter: err.retryAfter
        });
    }
    
    // CORS hatası
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS policy violation',
            message: 'Origin not allowed'
        });
    }
    
    // Validation hatası
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }
    
    // MongoDB hatası
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
        return res.status(500).json({
            error: 'Database Error',
            message: 'Veritabanı bağlantı hatası'
        });
    }
    
    // JWT hatası
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Authentication Error',
            message: 'Geçersiz token'
        });
    }
    
    // Genel hata
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Sunucu hatası oluştu' 
            : err.message
    });
};

module.exports = {
    authLimiter,
    generalLimiter,
    uploadLimiter,
    corsOptions,
    helmetConfig,
    sanitizeInput,
    requestLogger,
    errorHandler,
    helmet,
    cors
};
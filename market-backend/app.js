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

const app = express();

await connectDB();

const corsConfig = {
  origin: true, // Geçici olarak tüm origin'lere izin
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.setHeader("Access-Control-Allow-Origin", frontendUrl);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use('/uploads', express.static('uploads'));

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

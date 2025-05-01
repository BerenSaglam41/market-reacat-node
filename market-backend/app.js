import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import ProductRouter from "./routes/ProductRoutes.js";
import AdminRouter from "./routes/AdminRoutes.js";
import { createAdminUser } from "./config/createAdminUser.js";

const port = 5000;

const app = express();

await connectDB();

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//ROUTES
app.use("/api/products", ProductRouter);
app.use('/admin',AdminRouter);

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
app.listen(port, () => {
  console.log(`API http://localhost:${port} üzerinde çalışıyor.`);
});

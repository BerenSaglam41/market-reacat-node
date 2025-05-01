import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "./db.js";

export const createAdminUser = async () => {
  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    username: "admin",
    email: "admin@market.com",
    password: hashed,
    role: "admin"
  });

  console.log("Admin oluşturuldu");
};

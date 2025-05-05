import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique : true
  },
  email: String,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", // normal kullanıcı
    enum: ["user", "admin"],
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;

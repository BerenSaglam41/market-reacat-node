import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type : String,
    unique : true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", 
    enum: ["user", "admin"],
  },
  phone: {
    type: Number,
  },
  addresses: [
    {
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      district: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;

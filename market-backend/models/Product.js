import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique : true
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  category: {
    type: String,
    required: true,
    enum: ["food", "drink"],
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;

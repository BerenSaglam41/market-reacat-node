import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  cartInfo : {
    cartname : {
      type : String,
      required : true
    },
    cartnumber : {
      type : String,
      required : true
    },
    expirydate : {
      type : String,
      required : true
    },
    cvv : {
      type : String,
      required : true
    }
  }
  ,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Hazırlanıyor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);

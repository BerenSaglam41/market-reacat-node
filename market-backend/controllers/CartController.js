import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { formatCart } from "../config/formatCard.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find(item => item.product._id.toString() === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(formatCart(cart));
  } catch (error) {
    res.status(500).json({ message: "Sepete eklenirken hata oluştu", error: error.message });
  }
};



export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Sepet bulunamadı" });

    res.status(200).json(formatCart(cart));
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};


export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Sepet bulunamadı" });

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Ürün sepette bulunamadı" });

    if (cart.items[itemIndex].quantity > quantity) {
      cart.items[itemIndex].quantity -= quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json(formatCart(cart));
  } catch (error) {
    res.status(500).json({ message: "Sepetten çıkarılırken sunucu hatası", error: error.message });
  }
};


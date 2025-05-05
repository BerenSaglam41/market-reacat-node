import Cart from "../models/Cart.js";

export const addToCart = async (req,res,next) => {
    const { productId } = req.body;
    const userId = req.user.id;
  
    const cart = await Cart.findOne({ user: userId });
  
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
  
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }
  
    await cart.save();
    res.status(200).json({cart,success:true});
}

export const getCart = async (req,res,next) => {
    const userId = req.user.id;
    const cart = await Cart.findOne({user:userId}).populate("items.product");
    if(!cart) return res.status(404).json({message : "Sepet bulunamadı"});
    res.status(200).json(cart);
}

export const ensureCartExists = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      await Cart.create({ user: userId, items: [] });
    }
};

export const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
  
    const cart = await Cart.findOne({ user: userId });
  
    if (!cart) return res.status(404).json({ message: "Sepet bulunamadı" });
  
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Ürün sepette bulunamadı" });
    }
  
    // miktar kadar azalt
    if (cart.items[itemIndex].quantity > quantity) {
      cart.items[itemIndex].quantity -= quantity;
    } else {
      // ürün miktarı yetersizse komple kaldır
      cart.items.splice(itemIndex, 1);
    }
  
    await cart.save();
    res.status(200).json(cart);
};
  
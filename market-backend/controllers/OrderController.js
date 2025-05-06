import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address,cartInfo } = req.body;

    // Adres alanlarının kontrolü
    const requiredFieldsAddress = ["address", "city", "district", "phone"];
    const requiredFieldsCartInfo = ["cartname", "cartnumber", "expirydate", "cvv"];
    for (const field of requiredFieldsAddress) {
      if (!address[field]) {
        return res.status(400).json({ message: `Adres alanı eksik: ${field}` });
      }
    }
    for(const field of requiredFieldsCartInfo){
      if(!cartInfo[field]){
        return res.status(400).json({ message: `Cart alanı eksik: ${field}` });
      }
    }
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Sepetiniz boş." });
    }

    // Ürünleri ayıkla
    const items = cart.items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      user: userId,
      address,
      cartInfo,
      items,
      totalPrice: total,
    });

    await newOrder.save();

    // Sepeti temizle
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Sipariş başarıyla oluşturuldu.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error.message);
    res.status(500).json({ message: "Sipariş oluşturulamadı", error: error.message });
  }
};

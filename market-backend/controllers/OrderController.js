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


export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Siparişiniz bulunmamakta." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Siparişleri getirirken hata:", error.message);
    res.status(500).json({ message: "Siparişler getirilemedi", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Bu siparişi silme yetkiniz yok" });
    }

    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({ message: "Sipariş başarıyla iptal edildi" });
  } catch (error) {
    return res.status(500).json({ message: "Sipariş silinirken hata oluştu", error: error.message });
  }
};
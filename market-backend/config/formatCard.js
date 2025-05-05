export function formatCart(cartDoc) {
  if (!cartDoc || !Array.isArray(cartDoc.items)) {
    return {
      _id: null,
      user: null,
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }

  const items = cartDoc.items.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    brand: item.product.brand,
    category: item.product.category,
    quantity: item.quantity,
    total: item.quantity * item.product.price
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

  return {
    _id: cartDoc._id,
    user: cartDoc.user,
    items,
    totalItems,
    totalPrice,
    updatedAt: cartDoc.updatedAt
  };
}

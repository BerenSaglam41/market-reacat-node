import Product from "../models/Product.js";

const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export const validateProductInput = async (data) => {
  const { name, price, description, image, category, brand, stock } = data;
  const errors = {};
  // Name
  if (!name || name.trim() === "") {
    errors.name = "Name is required.";
  } else {
    const existing = await Product.findOne({ name });
    if (existing) {
      errors.name = "Product with this name already exists.";
    }
  }
  // Price
  if (price == null || isNaN(price)) {
    errors.price = "Valid price is required.";
  }
  // Image
  if (image) {
    const extension = image.toLowerCase().substring(image.lastIndexOf("."));
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    if (!allowedExtensions.includes(extension)) {
      errors.image = "Image must be one of: .jpg, .jpeg, .png, .gif, .webp";
    }
  }
  // Category
  const allowedCategories = ["food", "drink"];
  if (!category || category.trim() === "") {
    errors.category = "Category is required.";
  } else if (!allowedCategories.includes(category)) {
    errors.category = `Category must be one of: ${allowedCategories.join(
      ", "
    )}.`;
  }
  // Brand
  if (!brand || brand.trim() === "") {
    errors.brand = "Brand is required.";
  }
  // Stock
  if (stock == null || isNaN(stock)) {
    errors.stock = "Valid stock amount is required.";
  } else if (stock < 0) {
    errors.stock = "Stock cannot be less than 0.";
  }
  return errors;
};

export const validateProductUpdate = async (id, data) => {
  const { name, price, image, category, brand, stock } = data;
  const errors = {};

  // Name (sadece varsa kontrol et)
  if (name !== undefined) {
    if (name.trim() === "") {
      errors.name = "Name cannot be empty.";
    } else {
      const existing = await Product.findOne({ name });
      if (existing && existing._id.toString() !== id) {
        errors.name = "Another product with this name already exists.";
      }
    }
  }

  // Price
  if (price !== undefined) {
    if (isNaN(price)) {
      errors.price = "Price must be a valid number.";
    }
  }

  // Image
  if (image !== undefined) {
    const extension = image.toLowerCase().substring(image.lastIndexOf("."));
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    if (!allowedExtensions.includes(extension)) {
      errors.image = "Image must be one of: .jpg, .jpeg, .png, .gif, .webp";
    }
  }

  // Category
  if (category !== undefined) {
    const allowedCategories = ["food", "drink"];
    if (category.trim() === "") {
      errors.category = "Category cannot be empty.";
    } else if (!allowedCategories.includes(category)) {
      errors.category = `Category must be one of: ${allowedCategories.join(", ")}`;
    }
  }

  // Brand
  if (brand !== undefined) {
    if (brand.trim() === "") {
      errors.brand = "Brand cannot be empty.";
    }
  }

  // Stock
  if (stock !== undefined) {
    if (isNaN(stock)) {
      errors.stock = "Stock must be a valid number.";
    } else if (stock < 0) {
      errors.stock = "Stock cannot be less than 0.";
    }
  }

  return errors;
};

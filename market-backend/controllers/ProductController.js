import Product from "../models/Product.js";
import { validateProductInput, validateProductUpdate } from "../validations/ProductValidation.js";
import mongoose from 'mongoose'

export const getAll = async (req, res, nxet) => {
  try {
    const products = await Product.find();
    return res.json({ products });
  } catch (err) {
    next(err);
  }
};


export const getProduct = async (req,res,next) => {
    try{
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
              success: false,
              message: "Invalid product ID format.",
            });
          }
        const product = await Product.findById(id);
        return res.json({product})
    }   
    catch(err){
        next(err)
    }
}

export const addProduct = async (req, res, next) => {
  try {
    const errors = await validateProductInput(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }

    const newProduct = new Product(req.body);
    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product saved.", product: newProduct });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID format.",
        });
      }
      const errors = await validateProductUpdate(id, req.body);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation failed.", errors });
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      return res.status(200).json({ message: "Product updated.", product: updatedProduct });
  
    } catch (err) {
      next(err);
    }
  };

  export const deleteProduct = async (req,res,next) => {
    try{
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
              success: false,
              message: "Invalid product ID format.",
            });
          }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct){
            return res.status(404).json({success : false,message : "Başvuru bulunamadı!"});
        }
        return res.status(200).json({message : "Product Deleted."});
    }
    catch(err){
        next(err);
    }
  }

  export const StokArttir = async(req,res,next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { stock: 1 } },
        { new: true }
      );
      return res.json(product);
    } catch (err) {
      next(err);
    }
  }

  export const StokAzalt = async(req,res,next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product.stock > 0) {
        product.stock -= 1;
        await product.save();
      }
      return res.json(product);
    } catch (err) {
      next(err);
    }
  };
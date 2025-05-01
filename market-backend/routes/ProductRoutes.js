import express from 'express'
import { addProduct, deleteProduct, getAll, getProduct, updateProduct } from '../controllers/ProductController.js';

const ProductRouter = express.Router();

ProductRouter.get("/",getAll)
ProductRouter.get('/:id',getProduct);
ProductRouter.post('/',addProduct)
ProductRouter.put('/:id',updateProduct)
ProductRouter.delete('/:id',deleteProduct);


export default ProductRouter
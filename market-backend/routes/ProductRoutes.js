import express from 'express'
import { addProduct, deleteProduct, getAll, getPopularProducts, getProduct, StokArttir, StokAzalt, updateProduct } from '../controllers/ProductController.js';
import { verifyAdmin } from '../controllers/AdminController.js';
import { upload } from '../middlewares/uploadImage.js';

const ProductRouter = express.Router();

ProductRouter.get("/",getAll)
ProductRouter.get('/popular',getPopularProducts);
ProductRouter.get('/:id',getProduct);
ProductRouter.post('/',verifyAdmin,upload.single("image"),addProduct)
ProductRouter.put('/:id',updateProduct)
ProductRouter.delete('/:id',deleteProduct);
ProductRouter.put('/:id/increase',verifyAdmin,StokArttir)
ProductRouter.put('/:id/decrease',verifyAdmin,StokAzalt)

export default ProductRouter
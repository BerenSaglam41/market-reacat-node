import express from 'express'
import { addToCart, getCart, removeFromCart } from '../controllers/CartController.js'
import { verifyUser } from '../controllers/UserController.js';

const CartRouter = new express.Router()

CartRouter.post("/add",verifyUser,addToCart);
CartRouter.get("/get",verifyUser,getCart);
CartRouter.post('/remove',verifyUser,removeFromCart);

export default CartRouter
import express from 'express'
import { createOrder } from '../controllers/OrderController.js';
import { verifyUser } from '../controllers/UserController.js';

const OrderRouter = new express.Router()

OrderRouter.post("/add",verifyUser,createOrder);

export default OrderRouter
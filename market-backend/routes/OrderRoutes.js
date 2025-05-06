import express from 'express'
import { createOrder, deleteOrder, getOrders } from '../controllers/OrderController.js';
import { verifyUser } from '../controllers/UserController.js';
import Order from '../models/Order.js';

const OrderRouter = new express.Router()

OrderRouter.post("/add",verifyUser,createOrder);
OrderRouter.get("/get",verifyUser,getOrders);
OrderRouter.delete("/:id", verifyUser, deleteOrder);

export default OrderRouter
import express from 'express'
import { getMe, login, logout, verifyAdmin } from '../controllers/AdminController.js';
import { getAll } from '../controllers/ProductController.js';

const AdminRouter = express.Router();

AdminRouter.post("/login",login);
AdminRouter.post("/logout",logout);
AdminRouter.get("/admintest",verifyAdmin,getAll);
AdminRouter.get('/getAdmin',verifyAdmin,getMe)

export default AdminRouter
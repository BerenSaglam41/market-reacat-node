import express from 'express'
import { verifyAdmin } from '../controllers/AdminController.js';
import { getAll } from '../controllers/ProductController.js';

const AdminRouter = express.Router();

AdminRouter.get("/admintest",verifyAdmin,getAll);

export default AdminRouter
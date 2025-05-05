import express from 'express'
import { getMe, getUser, login, logout, registerUser } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post("/register",registerUser)
userRouter.post('/login',login);
userRouter.post("/logout",logout);
userRouter.get('/getme',getMe,getUser)

export default userRouter
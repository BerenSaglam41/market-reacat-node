import express from 'express'
import { addAddress, deleteAddress, getAddresses, getMe, getUser, login, logout, registerUser, updateAddress, updateUser, verifyUser } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post("/register",registerUser)
userRouter.put("/",verifyUser,updateUser)
userRouter.post('/login',login);
userRouter.post("/logout",logout);
userRouter.get('/getme',getMe,getUser)
userRouter.post('/address',verifyUser,addAddress)
userRouter.put('/address/:addressId',verifyUser,updateAddress);
userRouter.delete('/address/:addressId',verifyUser,deleteAddress);
userRouter.get('/address',verifyUser,getAddresses);
export default userRouter
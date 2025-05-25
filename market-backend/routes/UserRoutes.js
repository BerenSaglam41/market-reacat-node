import express from 'express';
import { 
  addAddress, 
  deleteAddress, 
  getAddresses, 
  getMe, 
  login, 
  logout, 
  registerUser, 
  updateAddress, 
  updateUser, 
  verifyUser 
} from '../controllers/UserController.js';

const userRouter = express.Router();

// Auth routes
userRouter.post("/register", registerUser);
userRouter.post('/login', login);
userRouter.post("/logout", logout);
userRouter.get('/getMe', getMe);

// Protected routes  
userRouter.put("/", verifyUser, updateUser);
userRouter.post('/address', verifyUser, addAddress);
userRouter.get('/address', verifyUser, getAddresses);
userRouter.put('/address/:addressId', verifyUser, updateAddress);
userRouter.delete('/address/:addressId', verifyUser, deleteAddress);

export default userRouter;

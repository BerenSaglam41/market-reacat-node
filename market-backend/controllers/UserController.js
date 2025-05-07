import { ValidateUser } from "../validations/UserValidation.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // JWT'den gelen kullanıcı ID
    const updateData = {};
    
    // Sadece gelen alanları güncelle
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phone) updateData.phone = req.body.phone;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error); // Express error handler
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const errors = await ValidateUser(req.body); 

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user"
    });

    await user.save();

    return res.status(201).json({
      message: "Kayıt başarılı",
      user: { username, email, role: "user" }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username or email already exists." });
    }
    next(err);
  }
};

export const getMe = async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) return res.status(403).json({message : "Token Eksik"});

    try{
        const decoded = jwt.verify(token,process.env.JSON_KEY);
        req.user = decoded;
        next();
    }
    catch(err){
        next(err);
    }
}

export const getUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token eksik" });

  try {
    const decoded = jwt.verify(token, process.env.JSON_KEY);
    const user = await User.findById(decoded.id).select("username role email phone");

    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Token geçersiz", expired: true });
  }
};

export const login = async (req,res,next) => {
  const { username,password} = req.body;
  const user = await User.findOne({username});
  if(!user){
      return res.status(401).json({message: "Kullanıcı Bulunamadı!"});
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch){
      return res.status(401).json({ message: "Şifre Hatalı!" }); 
  }
  const token = jwt.sign(
      {id : user._id,username:user.username,role:user.role},
      process.env.JSON_KEY,
      {expiresIn : "1d"}
  );
  res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 gün
  });
  return res.json({ success: true, username: user.username,role:user.role });
}

export const logout = async (req,res,next) =>{
  res.clearCookie("token",{
      httpOnly : true,
      sameSite : "strict",
      secure : false
  });
  res.json({message : "Çıkış  Yapıldı"})
}

export const verifyUser = async (req,res,next) =>{
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi. Token eksik.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JSON_KEY);    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Geçersiz token.' });
  }
}

// Add Address
export const addAddress = async (req, res) => {
  const userId = req.user.id;
  const { address, city, district, phone } = req.body;

  try {
    
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAddress = {
          address, city, district, phone
      };
      user.addresses.push(newAddress);
      await user.save();

      res.status(201).json(newAddress);
  } catch (err) {
      res.status(500).json({ message: "Error adding address", error: err.message });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const { address, city, district, phone } = req.body;

  try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const addressIndex = user.addresses.findIndex(item => item._id.toString() === addressId);
      if (addressIndex === -1) return res.status(404).json({ message: "Address not found" });

      user.addresses[addressIndex] = { address, city, district, phone };
      await user.save();

      res.status(200).json(user.addresses[addressIndex]);
  } catch (err) {
      res.status(500).json({ message: "Error updating address", error: err.message });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const addressIndex = user.addresses.findIndex(item => item._id.toString() === addressId);
      if (addressIndex === -1) return res.status(404).json({ message: "Address not found" });

      user.addresses.splice(addressIndex, 1);
      await user.save();

      res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Error deleting address", error: err.message });
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id; // veya req.user.id, senin kullanımına göre
    const user = await User.findById(userId).populate("addresses");
      
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(user.addresses);
  } catch (error) {
    next(error); // Express error handler'a gönder
  }
};

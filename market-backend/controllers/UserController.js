import { ValidateUser } from "../validations/UserValidation.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import User from "../models/User.js";  // Kullanıcı modelin
import { ensureCartExists } from "./CartController.js";

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
    const user = await User.findById(decoded.id).select("username role");

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
  await ensureCartExists(user.id);
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
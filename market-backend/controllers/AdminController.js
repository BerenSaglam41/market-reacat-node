import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'
dotenv.config()

export const verifyAdmin = async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) return res.status(403).json({message : "Token Eksik"});

    try{
        const decoded = jwt.verify(token,process.env.JSON_KEY);
        if(decoded.role !== "admin"){
            return res.status(403).json({message : "Admin yetkisi gerekli"});
        }   
        req.user = decoded;
        next();
    }
    catch(err){
        next(err);
    }
}

export const logout = async (req,res,next) =>{
    res.clearCookie("token",{
        httpOnly : true,
        sameSite : "strict",
        secure : false
    });
    res.json({message : "Çıkış  Yapıldı"})
}

export const login = async (req,res,next) => {
    const { username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(401).json({message: "Kullanıcı Bulunamadı!"});
    }
    if(user.role != "admin"){
        return res.status(403).json({message:"Erişim engellendi.Admin değil."});
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
    return res.json({ username: user.username });
}
export const getMe = async (req, res, next) => {
    try {
      const user = await User.findOne({username : req.user.username})
  
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      res
        .status(200)
        .json({ username: req.user.username, token: req.user.token });
    } catch (error) {
      next(error);
    }
  };
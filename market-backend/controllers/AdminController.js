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

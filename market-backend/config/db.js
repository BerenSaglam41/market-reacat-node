import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

// function to connect to the mongodb 
const connectDB = async () =>{
    mongoose.connection.on('connected', () => {
        console.log("✅ Database Connected Successfully!");
    });
    await mongoose.connect(`${process.env.MONGODB_URL}`)
};

export default connectDB 
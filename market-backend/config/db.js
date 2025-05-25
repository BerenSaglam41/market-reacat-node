import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

// function to connect to the mongodb 
const connectDB = async () =>{
    console.log('🔗 MongoDB URL:', process.env.MONGODB_URL); // Debug log
    
    mongoose.connection.on('connected', () => {
        console.log("✅ Database Connected Successfully!");
        console.log('📋 Database Name:', mongoose.connection.name);
        console.log('🗺️ Host:', mongoose.connection.host);
    });
    
    // Modern connection (deprecated options removed)
    await mongoose.connect(`${process.env.MONGODB_URL}`);
};

export default connectDB 
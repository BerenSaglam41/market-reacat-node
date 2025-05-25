import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

// function to connect to the mongodb 
const connectDB = async () =>{
    mongoose.connection.on('connected', () => {
        console.log("✅ Database Connected Successfully!");
    });
    
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(`${process.env.MONGODB_URL}`, options);
};

export default connectDB 
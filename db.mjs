import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DATABASE,) 
        console.log('Connected to MongoDB successfully');   
    }catch(error){
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with an error code
    }
    };

    export default connectDB;
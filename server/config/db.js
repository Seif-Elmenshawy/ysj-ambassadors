import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ysj-ambassadors';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

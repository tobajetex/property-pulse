import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  // If already connected, don't connect again
  if (isConnected) {
    console.log("✅ MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

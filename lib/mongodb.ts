import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
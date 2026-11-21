import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not set in environment variables!");
        throw new Error("MONGODB_URI is not set");
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("DB Connected");
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}



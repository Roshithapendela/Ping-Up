import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    mongoose.connection.on("error", (err) =>
      console.log("MongoDB connection error:", err)
    );
    await mongoose.connect(`${process.env.MONGODB_URL}/pingup`, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error.message);
  }
};

export default connectDB;

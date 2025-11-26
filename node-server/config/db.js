import mongoose from "mongoose";


export const connectDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Inboxonic",
    });
    console.log("Database connected");
   

  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

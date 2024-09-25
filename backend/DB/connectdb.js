import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB_URI);
    console.log(`connected DB ${conn.connection.host}`);
  } catch (error) {
    console.log(`error connecting with mongodb ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

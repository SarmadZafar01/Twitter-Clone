import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import connectDB from "./DB/connectdb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import notifiationRoutes from "./routes/notificationRoutes.js";
import { v2 as cloudianry } from "cloudinary";
import postRoutes from "./routes/PostRoutes.js";

dotenv.config();

cloudianry.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notifiationRoutes);

const port = process.env.PORT || 5000;
connectDB();

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

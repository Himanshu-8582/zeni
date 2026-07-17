import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js';
import cors from 'cors';
import job from "./utils/cron.js";

dotenv.config();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
const PORT = 5000;

app.use(express.json());

app.use('/health', (req,res) => {
  return res.status(200).json({ ok: true });
})

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log("Zeni backend running on port 5000")
  connectDB();
  if (process.env.NODE_ENV === "production") job.start();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    
    console.error("MongoDB connection error:", error);
  }
}
// app.post("/api/chat", async (req, res) => {
  
// });


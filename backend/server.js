// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// FRONTEND_URL environment variable (e.g. http://localhost:5173)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

// Use cors middleware with options — this will handle preflight OPTIONS automatically
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (ensure 'uploads' directory exists)
app.use(express.static("uploads"));

// Register routers
app.use(postsRoutes);
app.use(userRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`👉 Accepting requests from: ${FRONTEND_URL}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "hi vikas" });
});

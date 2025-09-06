import express from "express";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection (direct URL, no .env)
const MONGO_URI = "mongodb://localhost:27017/"; // change DB name if needed
const PORT = 5000; // you can change the port

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop app if DB fails
  });

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB!");
});

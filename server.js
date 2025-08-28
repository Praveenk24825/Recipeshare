/*

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Error handler middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",                 // local dev
  "https://qwery90.netlify.app",     // replace with your deployed frontend
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies/session
  })
);

// Middleware
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mealplans", mealPlanRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
*/
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet"; // FIX: Import helmet for Content Security Policy

// Routes
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Error handler middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FIX: Set a Content Security Policy to fix the 'blob' error
// This policy allows scripts from your own domain and from 'blob' URLs
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "blob:"],
      },
    },
  })
);

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "https://qwery90.netlify.app",
];

// Global CORS (This code was already correct)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10000mb" }));

// Serve uploaded files correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// FIX: Add a route for the base /api path to prevent the 404 error
// Your frontend was likely calling this route, which did not exist.
app.get("/api", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mealplans", mealPlanRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";         // follow, favorite, profile
import authRoutes from "./routes/authRoutes.js";         // register/login
import recipeRoutes from "./routes/recipeRoutes.js";     // CRUD, ratings, comments
import mealPlanRoutes from "./routes/mealPlanRoutes.js"; // meal plan CRUD

// Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

import path from "path";
import { fileURLToPath } from "url";

// Initialize dotenv and DB
dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // parse JSON

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealplans", mealPlanRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

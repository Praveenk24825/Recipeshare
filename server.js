import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js"; // Add meal plan routes
import { errorHandler } from "./middleware/errorMiddleware.js"; // Global error handler
import path from "path";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mealplans", mealPlanRoutes); // Meal plan routes

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

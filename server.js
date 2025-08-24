import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.netlify.app"],
    credentials: true,
  })
);

// Serve uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealplans", mealPlanRoutes);

app.get("/", (req, res) => res.send("API Running..."));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

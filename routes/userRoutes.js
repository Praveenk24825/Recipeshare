import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  followUser,
  toggleFavorite,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// ✅ Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected routes (require token)
router.put("/profile", protect, updateProfile);
router.put("/follow/:id", protect, followUser);
router.put("/favorite/:recipeId", protect, toggleFavorite);

export default router;

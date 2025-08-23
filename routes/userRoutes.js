import express from "express";
import { followUser, toggleFavorite, updateProfile, getProfile, getFavorites } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Follow / Unfollow
router.put("/follow/:id", protect, followUser);

// Add / Remove favorite
router.post("/favorite/:recipeId", protect, toggleFavorite);

// ✅ Get all favorites for current user
router.get("/favorites", protect, getFavorites);

// Update profile
router.put("/profile", protect, updateProfile);

// ✅ Get current user's profile
router.get("/profile", protect, getProfile);

export default router;

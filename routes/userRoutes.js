import express from "express";
import { getProfile, updateProfile, followUser, toggleFavorite, getFavorites } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Follow / Unfollow
router.put("/follow/:id", protect, followUser);

// Favorites
router.post("/favorite/:recipeId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

export default router;

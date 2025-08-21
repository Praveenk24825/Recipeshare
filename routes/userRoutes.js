import express from "express";
import { followUser, toggleFavorite, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Update profile
router.put("/profile", protect, updateProfile);

// Follow/Unfollow user
router.put("/follow/:id", protect, followUser);

// Toggle favorite recipe
router.put("/favorites/:recipeId", protect, toggleFavorite);

export default router;

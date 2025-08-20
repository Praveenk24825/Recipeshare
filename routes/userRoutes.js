import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  followUser,
  toggleFavorite,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

// 🔹 Follow / Unfollow a user
router.put("/follow/:id", protect, followUser);

// 🔹 Add / Remove favorite recipe
router.put("/favorite/:recipeId", protect, toggleFavorite);

// 🔹 Update user profile (name, bio, profilePic)
router.put("/profile", protect, updateProfile);

export default router;

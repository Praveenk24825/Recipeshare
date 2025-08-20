import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { followUser, toggleFavorite, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.put("/follow/:id", protect, followUser);
router.put("/favorite/:recipeId", protect, toggleFavorite);
router.put("/profile", protect, updateProfile);

export default router;

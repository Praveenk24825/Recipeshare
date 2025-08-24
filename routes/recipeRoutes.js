import express from "express";
import {
  createRecipe, getRecipes, getRecipeById,
  updateRecipe, deleteRecipe, addComment, addRating
} from "../controllers/recipeController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create recipe
router.post("/", protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), createRecipe);

// Get all recipes
router.get("/", getRecipes);

// Get single recipe
router.get("/:id", getRecipeById);

// Update recipe
router.put("/:id", protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), updateRecipe);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Comment & rating
router.post("/:id/comment", protect, addComment);
router.post("/:id/rating", protect, addRating);

export default router;

import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create recipe via raw JSON (no form-data)
router.post("/", protect, createRecipe);

// Get all recipes
router.get("/", getRecipes);

// Get single recipe
router.get("/:id", getRecipeById);

// Update recipe (JSON)
router.put("/:id", protect, updateRecipe);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Add comment
router.post("/:id/comment", protect, addComment);

// Add rating
router.post("/:id/rating", protect, addRating);

export default router;

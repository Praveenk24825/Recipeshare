import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
  searchRecipes
} from "../controllers/recipeController.js";

const router = express.Router();

// 🔹 Recipe CRUD
router.post("/", protect, createRecipe);        // Create recipe (protected)
router.get("/", getRecipes);                    // Get all recipes
router.get("/:id", getRecipeById);             // Get recipe by ID
router.put("/:id", protect, updateRecipe);     // Update recipe (protected)
router.delete("/:id", protect, deleteRecipe);  // Delete recipe (protected)

// 🔹 Comments & Ratings
router.post("/:id/comment", protect, addComment); // Add comment
router.post("/:id/rating", protect, addRating);   // Add or update rating

// 🔹 Search / Filter
router.get("/search", searchRecipes);           // Search by ingredient/cuisine/dietary

export default router;

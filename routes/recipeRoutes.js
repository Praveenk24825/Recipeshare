import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addRating,
  addComment,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Create a recipe with image/video upload
router.post("/", protect, upload.single("file"), createRecipe);

// ✅ Get all recipes with optional search/filter
router.get("/", getRecipes);

// ✅ Get single recipe by ID
router.get("/:id", getRecipeById);

// ✅ Update recipe with image/video upload
router.put("/:id", protect, upload.single("file"), updateRecipe);

// ✅ Delete recipe
router.delete("/:id", protect, deleteRecipe);

// ✅ Add rating to recipe
router.post("/:id/rate", protect, addRating);

// ✅ Add comment to recipe
router.post("/:id/comment", protect, addComment);

export default router;

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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create recipe with photo/video upload
router.post(
  "/",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

// Get all recipes
router.get("/", protect, getRecipes);

// Get single recipe
router.get("/:id", protect, getRecipeById);

// Update recipe
router.put("/:id", protect, updateRecipe);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Add comment
router.post("/:id/comment", protect, addComment);

// Add rating
router.post("/:id/rating", protect, addRating);

export default router;

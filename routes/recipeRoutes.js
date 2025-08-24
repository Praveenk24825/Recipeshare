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

// Get all recipes (for logged-in user)
router.get("/", protect, getRecipes);

// Get single recipe by id
router.get("/:id", protect, getRecipeById);

// Update recipe
router.put("/:id", protect, updateRecipe);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Comments and ratings
router.post("/:id/comment", protect, addComment);
router.post("/:id/rating", protect, addRating);

export default router;

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
import upload from "../middleware/uploadMiddleware.js"; // ✅ matches default export
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create recipe with image/video upload
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

// Get all recipes
router.get("/", getRecipes);

// Get single recipe
router.get("/:id", getRecipeById);

// Update recipe
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateRecipe
);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Add comment
router.post("/:id/comment", protect, addComment);

// Add rating
router.post("/:id/rating", protect, addRating);

export default router;

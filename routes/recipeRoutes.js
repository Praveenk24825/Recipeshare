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
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Recipe: accept both image & video
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

// Get recipe by ID
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

// Add rating
router.post("/:id/ratings", protect, addRating);

// Add comment
router.post("/:id/comments", protect, addComment);

export default router;

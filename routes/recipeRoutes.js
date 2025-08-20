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

router.post("/", protect, createRecipe);
router.get("/", getRecipes);
router.get("/search", searchRecipes); // For ingredient/cuisine/dietary filters
router.get("/:id", getRecipeById);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

// Comments & Ratings
router.post("/:id/comment", protect, addComment);
router.post("/:id/rating", protect, addRating);

export default router;

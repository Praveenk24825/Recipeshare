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

router.post("/", protect, upload.single("file"), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", protect, upload.single("file"), updateRecipe);
router.delete("/:id", protect, deleteRecipe);

router.post("/:id/ratings", protect, addRating);
router.post("/:id/comments", protect, addComment);

export default router;

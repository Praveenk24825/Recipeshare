import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// CRUD Routes
router.post("/", protect, upload.single("image"), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", protect, upload.single("image"), updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;

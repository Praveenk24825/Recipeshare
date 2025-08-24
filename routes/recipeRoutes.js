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
import upload from "../middleware/uploadMiddleware.js"; // 👈 use updated middleware

const router = express.Router();

router.post(
  "/",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);
router.post("/:id/comment", protect, addComment);
router.post("/:id/rating", protect, addRating);

export default router;

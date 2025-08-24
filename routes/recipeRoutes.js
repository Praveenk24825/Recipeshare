import express from "express";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, addComment, addRating } from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload image + video
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", protect, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), updateRecipe);
router.delete("/:id", protect, deleteRecipe);

router.post("/:id/comment", protect, addComment);
router.post("/:id/rating", protect, addRating);

export default router;

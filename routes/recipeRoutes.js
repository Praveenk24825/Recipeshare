import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRating,
} from "../controllers/recipeController.js";

const router = express.Router();

// Create recipe with image & video
router.post(
  "/",
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "video", maxCount: 1 }]),
  createRecipe
);

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put(
  "/:id",
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "video", maxCount: 1 }]),
  updateRecipe
);
router.delete("/:id", deleteRecipe);

router.put("/:id/comment", addComment);
router.put("/:id/rating", addRating);

export default router;

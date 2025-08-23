// routes/recipeRoutes.js
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

// ✅ Create recipe with image + video upload
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

// ✅ Get all recipes
router.get("/", getRecipes);

// ✅ Get recipe by ID
router.get("/:id", getRecipeById);

// ✅ Update recipe with optional new image/video
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateRecipe
);

// ✅ Delete recipe
router.delete("/:id", deleteRecipe);

// ✅ Add comment
router.post("/:id/comments", addComment);

// ✅ Add rating
router.post("/:id/ratings", addRating);

export default router;

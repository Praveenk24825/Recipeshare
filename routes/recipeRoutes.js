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

// ✅ Create recipe with image & video upload
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

// ✅ Get single recipe
router.get("/:id", getRecipeById);

// ✅ Update recipe (allow image/video upload)
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

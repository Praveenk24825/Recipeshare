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
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";


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

router.post("/:id/comment", addComment);
router.post("/:id/rating", addRating);


router.post("/favorites", protect, addFavorite);
router.delete("/favorites", protect, removeFavorite);
router.get("/favorites", protect, getFavorites);


export default router;

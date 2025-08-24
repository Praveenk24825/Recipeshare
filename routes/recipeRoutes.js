/* import express from "express";
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

const router = express.Router();

// ✅ Create recipe via raw JSON (no form-data)
router.post("/", protect, createRecipe);

// Get all recipes
router.get("/", getRecipes);

// Get single recipe
router.get("/:id", getRecipeById);

// Update recipe (JSON)
router.put("/:id", protect, updateRecipe);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Add comment
router.post("/:id/comment", protect, addComment);

// Add rating
router.post("/:id/rating", protect, addRating);

export default router;
*/

// routes/recipeRoutes.js
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
import multer from "multer";
import path from "path";

// 📂 Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure you have "uploads" folder in root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = express.Router();

// ✅ Create recipe with file upload (photo + video optional)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

// Get all recipes
router.get("/", getRecipes);

// Get single recipe
router.get("/:id", getRecipeById);

// Update recipe
router.put("/:id", protect, updateRecipe);

// Delete recipe
router.delete("/:id", protect, deleteRecipe);

// Add comment
router.post("/:id/comment", protect, addComment);

// Add rating
router.post("/:id/rating", protect, addRating);

export default router;

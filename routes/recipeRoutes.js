import express from "express";
import multer from "multer";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  rateRecipe,
  commentRecipe,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("image"), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/:id/rate", protect, rateRecipe);
router.post("/:id/comment", protect, commentRecipe);

export default router;

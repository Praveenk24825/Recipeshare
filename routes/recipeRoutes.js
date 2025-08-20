import express from 'express';
const router = express.Router();
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  commentRecipe
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

// Create a recipe
router.post('/', protect, createRecipe);

// Get all recipes
router.get('/', getRecipes);

// Get single recipe
router.get('/:id', getRecipeById);

// Update recipe
router.put('/:id', protect, updateRecipe);

// Delete recipe
router.delete('/:id', protect, deleteRecipe);

// Rate recipe
router.post('/:id/rate', protect, rateRecipe);

// Comment on recipe
router.post('/:id/comment', protect, commentRecipe);

export default router;

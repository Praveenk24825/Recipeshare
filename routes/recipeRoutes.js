import express from 'express';
import { getRecipes, addRecipe, rateRecipe, commentRecipe } from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getRecipes).post(protect, addRecipe);
router.route('/rate').post(protect, rateRecipe);
router.route('/comment').post(protect, commentRecipe);

export default router;

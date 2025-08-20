import express from "express";
import { addRecipeToMealPlan } from "../controllers/mealPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing routes ...

// NEW: Add recipe to meal plan
router.put("/add", protect, addRecipeToMealPlan);

export default router;

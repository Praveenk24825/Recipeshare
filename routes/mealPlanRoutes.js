import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addMealPlan,
  getMealPlans,
  deleteMealPlan,
} from "../controllers/mealPlanController.js";

const router = express.Router();

router.post("/", protect, addMealPlan);           // Create meal plan
router.get("/", protect, getMealPlans);           // Get all meal plans
router.delete("/:planId", protect, deleteMealPlan); // Delete a meal plan

export default router;

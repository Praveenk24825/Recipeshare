import express from "express";
import { createMealPlan, getMealPlans, deleteMealPlan } from "../controllers/mealPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createMealPlan).get(protect, getMealPlans);
router.route("/:id").delete(protect, deleteMealPlan);

export default router;

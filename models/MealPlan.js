import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: String,
  recipes: [{
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    day: { type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    mealType: { type: String, enum: ["Breakfast","Lunch","Dinner","Snack"] },
  }]
}, { timestamps: true });

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
export default MealPlan;

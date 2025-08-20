import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// Add a new meal plan
export const addMealPlan = async (req, res) => {
  const { name, recipeIds } = req.body; // recipeIds is an array
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.mealPlans.push({ name, recipes: recipeIds });
  await user.save();
  res.status(201).json(user.mealPlans);
};

// Get all meal plans of the logged-in user
export const getMealPlans = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "mealPlans.recipes",
    select: "title ingredients cookingTime servings image"
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.mealPlans);
};

// Delete a meal plan
export const deleteMealPlan = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const plan = user.mealPlans.id(req.params.planId);
  if (!plan) return res.status(404).json({ message: "Meal plan not found" });

  plan.remove();
  await user.save();
  res.json(user.mealPlans);
};

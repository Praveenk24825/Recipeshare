import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';

// Create meal plan
export const createMealPlan = async (req, res) => {
  const { title, description, recipes } = req.body;
  try {
    const mealPlan = await MealPlan.create({
      user: req.user._id,
      title,
      description,
      recipes
    });
    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all meal plans for logged-in user
export const getMealPlans = async (req, res) => {
  const mealPlans = await MealPlan.find({ user: req.user._id }).populate('recipes.recipe', 'title ingredients');
  res.json(mealPlans);
};

// Delete meal plan
export const deleteMealPlan = async (req, res) => {
  const mealPlan = await MealPlan.findById(req.params.id);
  if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
  await mealPlan.remove();
  res.json({ message: 'Meal plan deleted' });
};

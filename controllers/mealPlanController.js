import MealPlan from "../models/MealPlan.js";

// Add a single recipe to existing meal plan
export const addRecipeToMealPlan = async (req, res) => {
  try {
    const { mealPlanId, recipe, day, mealType } = req.body;

    if (!mealPlanId || !recipe || !day || !mealType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

    // Push new recipe
    mealPlan.recipes.push({ recipe, day, mealType });
    await mealPlan.save();

    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

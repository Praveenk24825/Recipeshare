import Recipe from "../models/Recipe.js";

// ➡️ CREATE a recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, cookingTime, servings } = req.body;

    const newRecipe = await Recipe.create({
      title,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
      steps: Array.isArray(steps) ? steps : steps.split(","),
      cookingTime,
      servings,
      image: req.file ? req.file.path : null,
      createdBy: req.user._id,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ➡️ GET all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name email");
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➡️ GET single recipe
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➡️ UPDATE a recipe
export const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, cookingTime, servings } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title,
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
        steps: Array.isArray(steps) ? steps : steps.split(","),
        cookingTime,
        servings,
        image: req.file ? req.file.path : undefined,
      },
      { new: true }
    );

    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ➡️ DELETE a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

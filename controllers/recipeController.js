import Recipe from "../models/Recipe.js";

// 👉 Create Recipe
export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 👉 Get All Recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👉 Get Recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👉 Update Recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 👉 Delete Recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

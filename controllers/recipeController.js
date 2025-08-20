import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

// Create Recipe
export const createRecipe = async (req, res) => {
  const { title, ingredients, steps, cookingTime, servings } = req.body;
  const image = req.file ? req.file.path : null;

  const recipe = await Recipe.create({
    user: req.user._id,
    title,
    ingredients: ingredients.split(","),
    steps,
    cookingTime,
    servings,
    image,
  });
  res.status(201).json(recipe);
};

// Get All Recipes with filters
export const getRecipes = async (req, res) => {
  const { ingredient, title } = req.query;
  let filter = {};
  if (ingredient) filter.ingredients = { $regex: ingredient, $options: "i" };
  if (title) filter.title = { $regex: title, $options: "i" };
  const recipes = await Recipe.find(filter).populate("user", "name profilePic");
  res.json(recipes);
};

// Get Single Recipe
export const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("user", "name profilePic");
  if (recipe) res.json(recipe);
  else res.status(404).json({ message: "Recipe not found" });
};

// Rate Recipe
export const rateRecipe = async (req, res) => {
  const { rating } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  const existing = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
  if (existing) {
    existing.rating = rating;
  } else {
    recipe.ratings.push({ user: req.user._id, rating });
  }
  await recipe.save();
  res.json(recipe);
};

// Comment Recipe
export const commentRecipe = async (req, res) => {
  const { comment } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  recipe.comments.push({ user: req.user._id, comment });
  await recipe.save();
  res.json(recipe);
};

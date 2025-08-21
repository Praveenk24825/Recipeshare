import Recipe from "../models/Recipe.js";
import asyncHandler from "express-async-handler";
import path from "path";

// Create Recipe
export const createRecipe = asyncHandler(async (req, res) => {
  const recipeData = { ...req.body, createdBy: req.user._id };

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if ([".mp4", ".mov", ".avi"].includes(ext)) recipeData.videoUrl = `/uploads/${req.file.filename}`;
    else recipeData.imageUrl = `/uploads/${req.file.filename}`;
  }

  const recipe = new Recipe(recipeData);
  await recipe.save();
  res.status(201).json(recipe);
});

// Get All Recipes
export const getRecipes = asyncHandler(async (req, res) => {
  const { ingredient, title } = req.query;
  let query = {};
  if (ingredient) query.ingredients = { $regex: ingredient, $options: "i" };
  if (title) query.title = { $regex: title, $options: "i" };
  const recipes = await Recipe.find(query);
  res.json(recipes);
});

// Get Recipe by ID
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json(recipe);
});

// Update Recipe
export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  Object.assign(recipe, req.body);

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if ([".mp4", ".mov", ".avi"].includes(ext)) recipe.videoUrl = `/uploads/${req.file.filename}`;
    else recipe.imageUrl = `/uploads/${req.file.filename}`;
  }

  await recipe.save();
  res.json(recipe);
});

// Delete Recipe
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json({ message: "Recipe deleted successfully" });
});

// Add Rating
export const addRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.ratings = recipe.ratings.filter(r => r.user.toString() !== req.user._id.toString());
  recipe.ratings.push({ user: req.user._id, rating });
  await recipe.save();
  res.json(recipe);
});

// Add Comment
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.comments.push({ user: req.user._id, comment });
  await recipe.save();
  res.json(recipe);
});

import asyncHandler from 'express-async-handler';
import Recipe from '../models/Recipe.js';

// Create a recipe
const createRecipe = asyncHandler(async (req, res) => {
  const { title, ingredients, steps, cookingTime, servings, image, video } = req.body;

  const recipe = await Recipe.create({
    user: req.user._id,
    title,
    ingredients,
    steps,
    cookingTime,
    servings,
    image,
    video
  });

  res.status(201).json(recipe);
});

// Get all recipes
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({});
  res.json(recipes);
});

// Get single recipe
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe) res.json(recipe);
  else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

// Update recipe
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  Object.assign(recipe, req.body);
  const updatedRecipe = await recipe.save();
  res.json(updatedRecipe);
});

// Delete recipe
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  await recipe.remove();
  res.json({ message: 'Recipe removed' });
});

// Rate recipe
const rateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  const { rating } = req.body;
  recipe.ratings.push({ user: req.user._id, rating });
  await recipe.save();
  res.json(recipe);
});

// Comment on recipe
const commentRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  const { comment } = req.body;
  recipe.comments.push({ user: req.user._id, comment });
  await recipe.save();
  res.json(recipe);
});

export {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  commentRecipe
};

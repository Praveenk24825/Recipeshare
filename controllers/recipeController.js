import Recipe from "../models/Recipe.js";
import asyncHandler from "express-async-handler";
import path from "path";

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = asyncHandler(async (req, res) => {
  const recipeData = { ...req.body, createdBy: req.user._id };

  // Handle uploaded files
  if (req.files) {
    if (req.files.image && req.files.image.length > 0) {
      recipeData.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files.video && req.files.video.length > 0) {
      recipeData.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }
  }

  const recipe = new Recipe(recipeData);
  await recipe.save();
  res.status(201).json(recipe);
});

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find().populate("createdBy", "name email");
  res.json(recipes);
});

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }
  res.json(recipe);
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  Object.assign(recipe, req.body);

  // Handle uploaded files
  if (req.files) {
    if (req.files.image && req.files.image.length > 0) {
      recipe.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files.video && req.files.video.length > 0) {
      recipe.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }
  }

  await recipe.save();
  res.json(recipe);
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  await recipe.deleteOne();
  res.json({ message: "Recipe removed" });
});

// @desc    Add rating
// @route   POST /api/recipes/:id/ratings
// @access  Private
export const addRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  recipe.ratings.push({ user: req.user._id, rating });
  await recipe.save();
  res.json(recipe);
});

// @desc    Add comment
// @route   POST /api/recipes/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  recipe.comments.push({ user: req.user._id, text });
  await recipe.save();
  res.json(recipe);
});
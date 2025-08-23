import Recipe from "../models/Recipe.js";
import asyncHandler from "express-async-handler";
import path from "path";

// ✅ Create Recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = asyncHandler(async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;

    if (!title || !description || !ingredients || !steps) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const recipeData = {
      title,
      description,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
      steps: Array.isArray(steps) ? steps : steps.split(","),
      createdBy: req.user._id,
    };

    // ✅ Handle uploaded files
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

    res.status(201).json({ message: "Recipe added successfully", recipe });
  } catch (error) {
    res.status(500).json({ message: "Failed to add recipe", error: error.message });
  }
});

// ✅ Get All Recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find().populate("createdBy", "name email");
  res.json(recipes);
});

// ✅ Get Recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  res.json(recipe);
});

// ✅ Update Recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.title = req.body.title || recipe.title;
  recipe.description = req.body.description || recipe.description;
  recipe.ingredients = req.body.ingredients ? req.body.ingredients.split(",") : recipe.ingredients;
  recipe.steps = req.body.steps ? req.body.steps.split(",") : recipe.steps;

  // ✅ Handle uploaded files
  if (req.files) {
    if (req.files.image && req.files.image.length > 0) {
      recipe.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files.video && req.files.video.length > 0) {
      recipe.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }
  }

  await recipe.save();
  res.json({ message: "Recipe updated successfully", recipe });
});

// ✅ Delete Recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  await recipe.deleteOne();
  res.json({ message: "Recipe removed successfully" });
});

// ✅ Add Rating
// @route   POST /api/recipes/:id/ratings
// @access  Private
export const addRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.ratings.push({ user: req.user._id, rating });
  await recipe.save();

  res.json({ message: "Rating added successfully", recipe });
});

// ✅ Add Comment
// @route   POST /api/recipes/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.comments.push({ user: req.user._id, text });
  await recipe.save();

  res.json({ message: "Comment added successfully", recipe });
});

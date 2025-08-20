import Recipe from "../models/Recipe.js";
import asyncHandler from "express-async-handler";

// 👉 Create a recipe
export const createRecipe = asyncHandler(async (req, res) => {
  const { title, description, ingredients, steps, cookingTime, servings, imageUrl, videoUrl, cuisine, dietary } = req.body;

  if (!title || !description || !ingredients || !steps || !cookingTime || !servings) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const recipe = new Recipe({
    title,
    description,
    ingredients,
    steps,
    cookingTime,
    servings,
    imageUrl: imageUrl || "",
    videoUrl: videoUrl || "",
    createdBy: req.user._id,
    cuisine: cuisine || "",
    dietary: dietary || ""
  });

  await recipe.save();
  res.status(201).json(recipe);
});

// 👉 Get all recipes
export const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// 👉 Get recipe by ID
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }
  res.json(recipe);
});

// 👉 Update recipe
export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  Object.assign(recipe, req.body); // Update all fields
  await recipe.save();
  res.json(recipe);
});

// 👉 Delete recipe
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  await recipe.remove();
  res.json({ message: "Recipe deleted successfully" });
});

// 👉 Add comment to recipe
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.comments.push({ user: req.user._id, comment });
  await recipe.save();
  res.status(201).json(recipe);
});

// 👉 Add rating to recipe
export const addRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  const existing = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
  if (existing) existing.rating = rating;
  else recipe.ratings.push({ user: req.user._id, rating });

  await recipe.save();
  res.status(201).json(recipe);
});

// 👉 Search/filter recipes
export const searchRecipes = asyncHandler(async (req, res) => {
  const { ingredient, cuisine, dietary } = req.query;
  let query = {};
  if (ingredient) query.ingredients = { $regex: ingredient, $options: "i" };
  if (cuisine) query.cuisine = { $regex: cuisine, $options: "i" };
  if (dietary) query.dietary = { $regex: dietary, $options: "i" };

  const recipes = await Recipe.find(query);
  res.json(recipes);
});

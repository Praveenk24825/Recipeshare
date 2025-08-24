import Recipe from "../models/Recipe.js";

// Create Recipe
export const createRecipe = async (req, res) => {
  const { title, description, ingredients, steps, cookingTime, servings } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title and description required" });

  const newRecipe = new Recipe({
    title,
    description,
    ingredients: ingredients ? JSON.parse(ingredients) : [],
    steps: steps ? JSON.parse(steps) : [],
    cookingTime,
    servings,
    createdBy: req.user._id,
    imageUrl: req.files?.image ? req.files.image[0].path : "",
    videoUrl: req.files?.video ? req.files.video[0].path : "",
  });

  const savedRecipe = await newRecipe.save();
  res.status(201).json(savedRecipe);
};

// Get all recipes
export const getRecipes = async (req, res) => {
  const recipes = await Recipe.find().populate("createdBy", "name email");
  res.json(recipes);
};

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json(recipe);
};

// Update recipe
export const updateRecipe = async (req, res) => {
  const updates = req.body;
  if (req.files?.image) updates.imageUrl = `/uploads/${req.files.image[0].filename}`;
  if (req.files?.video) updates.videoUrl = `/uploads/${req.files.video[0].filename}`;
  if (updates.ingredients) updates.ingredients = JSON.parse(updates.ingredients);
  if (updates.steps) updates.steps = JSON.parse(updates.steps);

  const recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json(recipe);
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json({ message: "Recipe deleted" });
};

// Add comment
export const addComment = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.comments.push({ user: req.user._id, comment: req.body.comment });
  await recipe.save();
  res.json(recipe);
};

// Add rating
export const addRating = async (req, res) => {
  const { rating } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  const existing = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
  if (existing) existing.rating = rating;
  else recipe.ratings.push({ user: req.user._id, rating });

  await recipe.save();
  res.json(recipe);
};

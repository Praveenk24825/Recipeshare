import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
// Create recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const photo = req.files?.photo ? `/uploads/images/${req.files.photo[0].filename}` : null;
    const video = req.files?.video ? `/uploads/videos/${req.files.video[0].filename}` : null;

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients ? ingredients.split(",") : [],
      steps: steps ? steps.split(",") : [],
      cookingTime,
      servings,
      photo,
      video,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single recipe
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.ingredients = req.body.ingredients ? req.body.ingredients.split(",") : recipe.ingredients;
    recipe.steps = req.body.steps ? req.body.steps.split(",") : recipe.steps;
    recipe.cookingTime = req.body.cookingTime || recipe.cookingTime;
    recipe.servings = req.body.servings || recipe.servings;

    if (req.files?.photo) {
      recipe.photo = `/uploads/images/${req.files.photo[0].filename}`;
    }
    if (req.files?.video) {
      recipe.video = `/uploads/videos/${req.files.video[0].filename}`;
    }

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    // Use authenticated user
    recipe.comments.push({
      userId: req.user._id,
      userName: req.user.name,
      text,
    });

    await recipe.save();
    res.json({ comments: recipe.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add rating
export const addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be 1-5" });

    // Remove previous rating by this user
    recipe.ratings = recipe.ratings.filter(r => !r.userId.equals(req.user._id));

    recipe.ratings.push({
      userId: req.user._id,
      userName: req.user.name,
      rating,
    });

    // Compute average rating
    recipe.rating =
      recipe.ratings.reduce((acc, r) => acc + r.rating, 0) / recipe.ratings.length;

    await recipe.save();
    res.json({ rating: recipe.rating, ratings: recipe.ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
import Recipe from "../models/Recipe.js";

// Create Recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const photo = req.files?.photo
      ? `/uploads/${req.files.photo[0].filename}`
      : null;

    const video = req.files?.video
      ? `/uploads/${req.files.video[0].filename}`
      : null;

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      steps: steps ? JSON.parse(steps) : [],
      cookingTime,
      servings,
      photo,
      video,
      createdBy: req.user._id,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all recipes by logged-in user
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id }).populate(
      "createdBy",
      "name email"
    );
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single recipe
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const updates = {};

    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.cookingTime) updates.cookingTime = req.body.cookingTime;
    if (req.body.servings) updates.servings = req.body.servings;

    if (req.body.ingredients) updates.ingredients = JSON.parse(req.body.ingredients);
    if (req.body.steps) updates.steps = JSON.parse(req.body.steps);

    if (req.files?.photo) {
      updates.photo = `/uploads/${req.files.photo[0].filename}`;
    }

    if (req.files?.video) {
      updates.video = `/uploads/${req.files.video[0].filename}`;
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    console.error("Update recipe error:", err);
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

    recipe.comments.push({ user: req.user._id, comment: req.body.comment });
    await recipe.save();

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add rating
export const addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existing = recipe.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existing) existing.rating = req.body.rating;
    else recipe.ratings.push({ user: req.user._id, rating: req.body.rating });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/recipeController.js
import Recipe from "../models/Recipe.js";

export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const photo = req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : null;
    const video = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients?.split(","),
      steps,
      cookingTime,
      servings,
      photo,
      video,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all recipes created by logged-in user
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

// ✅ Get single recipe by ID
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

// ✅ Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const updates = req.body;

    // Handle new image/video uploads
    if (req.files?.image) updates.imageUrl = req.files.image[0].path;
    if (req.files?.video) updates.videoUrl = req.files.video[0].path;

    if (updates.ingredients) updates.ingredients = JSON.parse(updates.ingredients);
    if (updates.steps) updates.steps = JSON.parse(updates.steps);

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add comment
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

// ✅ Add rating
export const addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existing = recipe.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existing) existing.rating = req.body.rating; // Update
    else recipe.ratings.push({ user: req.user._id, rating: req.body.rating });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

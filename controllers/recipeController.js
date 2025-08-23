import Recipe from "../models/Recipe.js";

// Create Recipe with image + video upload
export const createRecipe = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      steps: steps ? JSON.parse(steps) : [],
      cookingTime,
      servings,
      user: req.user._id,
      imageUrl: req.files?.image ? req.files.image[0].path : "",
      videoUrl: req.files?.video ? req.files.video[0].path : "",
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name email");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single recipe
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const updates = req.body;

    if (req.files?.image) {
      updates.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video) {
      updates.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    if (updates.ingredients) updates.ingredients = JSON.parse(updates.ingredients);
    if (updates.steps) updates.steps = JSON.parse(updates.steps);

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add rating
export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existing = recipe.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (existing) {
      existing.rating = rating; // update
    } else {
      recipe.ratings.push({ user: req.user._id, rating });
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

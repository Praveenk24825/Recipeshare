import Recipe from "../models/Recipe.js";

// Create Recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Uploaded file paths
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
      user: req.user._id, // logged in user
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Server error while creating recipe" });
  }
};


// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("user", "name email");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single recipe
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("user", "name email");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.ingredients = req.body.ingredients
      ? req.body.ingredients.split(",")
      : recipe.ingredients;
    recipe.steps = req.body.steps ? req.body.steps.split(",") : recipe.steps;
    recipe.cookingTime = req.body.cookingTime || recipe.cookingTime;
    recipe.servings = req.body.servings || recipe.servings;

    if (req.files?.photo) recipe.photo = `/uploads/images/${req.files.photo[0].filename}`;
    if (req.files?.video) recipe.video = `/uploads/videos/${req.files.video[0].filename}`;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    await recipe.deleteOne();
    res.json({ message: "Recipe removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const comment = {
      user: req.user._id,
      comment: req.body.comment,
    };

    recipe.comments.push(comment);
    await recipe.save();
    res.status(201).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add rating
export const addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const rating = {
      user: req.user._id,
      rating: req.body.rating,
    };

    recipe.ratings.push(rating);
    await recipe.save();
    res.status(201).json(recipe.ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

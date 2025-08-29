import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
// Create recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    // ✅ Fix: access [0] from multer file array
    const photo = req.files?.photo?.[0]
      ? `/uploads/images/${req.files.photo[0].filename}`
      : null;

    const video = req.files?.video?.[0]
      ? `/uploads/videos/${req.files.video[0].filename}`
      : null;

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

// Get all recipes (with optional search)
export const getRecipes = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
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

    if (!req.user || !req.user.name) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    // Add comment
    recipe.comments.push({
      user: req.user.name,
      comment: text.trim(),
    });

    await recipe.save();
    res.json({ comments: recipe.comments });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add rating
export const addRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (!req.user || !req.user.name) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ratingValue = Number(req.body.rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    // Remove old rating by this user
    recipe.ratings = recipe.ratings.filter(r => r.user !== req.user.name);

    // Add new rating
    recipe.ratings.push({
      user: req.user.name,
      rating: ratingValue,
    });

    // Update average rating
    recipe.rating = recipe.ratings.reduce((acc, r) => acc + r.rating, 0) / recipe.ratings.length;

    await recipe.save();
    res.json({ rating: recipe.rating, ratings: recipe.ratings });
  } catch (err) {
    console.error("Add rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ... (all other functions remain the same)

// Add favorite
export const addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { recipeId } = req.body;
        if (!recipeId) return res.status(400).json({ message: "Recipe ID required" });

        if (!user.favorites.includes(recipeId)) {
            user.favorites.push(recipeId);
            await user.save();
        }

        // ✅ Fix: Return the populated user document
        const populatedUser = await User.findById(req.user._id).populate("favorites");
        res.json({ favorites: populatedUser.favorites });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Remove favorite
export const removeFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { recipeId } = req.body;
        user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
        await user.save();

        // ✅ Fix: Return the populated user document
        const populatedUser = await User.findById(req.user._id).populate("favorites");
        res.json({ favorites: populatedUser.favorites });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all favorite recipes
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("favorites");
        res.json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ... (all other functions remain the same)

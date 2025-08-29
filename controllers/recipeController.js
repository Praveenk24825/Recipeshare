import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Helper for Cloudinary upload
const uploadToCloudinary = async (filePath, folder, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder, resource_type: resourceType });
    return result.secure_url;
  } catch (err) {
    console.error(`Cloudinary upload error (${resourceType}):`, err);
    throw new Error(`Failed to upload ${resourceType}`);
  }
};

// Create recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Title and description required" });

    let photoUrl = null;
    let videoUrl = null;

    if (req.files?.photo?.[0]) photoUrl = await uploadToCloudinary(req.files.photo[0].path, "recipes/images");
    if (req.files?.video?.[0]) videoUrl = await uploadToCloudinary(req.files.video[0].path, "recipes/videos", "video");

    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients ? ingredients.split(",") : [],
      steps: steps ? steps.split(",") : [],
      cookingTime,
      servings,
      photo: photoUrl,
      video: videoUrl,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Create recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all recipes (optional search)
export const getRecipes = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { title: { $regex: search, $options: "i" } } : {};
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error("Get recipes error:", err);
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
    console.error("Get recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients ? ingredients.split(",") : recipe.ingredients;
    recipe.steps = steps ? steps.split(",") : recipe.steps;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;

    if (req.files?.photo?.[0]) recipe.photo = await uploadToCloudinary(req.files.photo[0].path, "recipes/images");
    if (req.files?.video?.[0]) recipe.video = await uploadToCloudinary(req.files.video[0].path, "recipes/videos", "video");

    await recipe.save();
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
    console.error("Delete recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Comment text required" });
    if (!req.user?.name) return res.status(401).json({ message: "Unauthorized" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.comments.push({ user: req.user.name, comment: text.trim() });
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
    const ratingValue = Number(req.body.rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5)
      return res.status(400).json({ message: "Rating must be 1-5" });
    if (!req.user?.name) return res.status(401).json({ message: "Unauthorized" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Remove old rating by this user
    recipe.ratings = recipe.ratings.filter(r => r.user !== req.user.name);

    // Add new rating
    recipe.ratings.push({ user: req.user.name, rating: ratingValue });

    // Update average rating
    recipe.rating = recipe.ratings.reduce((acc, r) => acc + r.rating, 0) / recipe.ratings.length;

    await recipe.save();
    res.json({ rating: recipe.rating, ratings: recipe.ratings });
  } catch (err) {
    console.error("Add rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add favorite
export const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: "Recipe ID required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recipeExists = await Recipe.findById(recipeId);
    if (!recipeExists) return res.status(404).json({ message: "Recipe not found" });

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }

    const populatedUser = await User.findById(req.user._id).populate("favorites");
    res.json({ favorites: populatedUser.favorites });
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove favorite
export const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: "Recipe ID required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate("favorites");
    res.json({ favorites: populatedUser.favorites });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all favorite recipes
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

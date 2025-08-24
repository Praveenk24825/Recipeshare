import Recipe from "../models/Recipe.js";

// Create Recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings } = req.body;

    if (!title || !description) return res.status(400).json({ message: "Title and description required" });

const newRecipe = new Recipe({
  title,
  description,
  ingredients,
  steps,
  cookingTime,
  servings,
  createdBy: req.user._id,
  imageUrl: req.files?.image ? req.files.image[0].path : "",
  videoUrl: req.files?.video ? req.files.video[0].path : "",
});
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  const recipes = await Recipe.find().populate("createdBy", "name email");
  res.json(recipes);
};

// Get single recipe
export const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json(recipe);
};

// Update Recipe
export const updateRecipe = async (req, res) => {
  const updates = req.body;
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json(recipe);
};

// Delete Recipe
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
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  const existing = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
  if (existing) existing.rating = req.body.rating;
  else recipe.ratings.push({ user: req.user._id, rating: req.body.rating });

  await recipe.save();
  res.json(recipe);
};

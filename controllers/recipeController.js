import Recipe from '../models/Recipe.js';

// Add recipe
export const addRecipe = async (req, res) => {
  const { title, ingredients, steps, cookingTime, servings, image, video } = req.body;
  try {
    const recipe = await Recipe.create({
      user: req.user._id,
      title,
      ingredients, // should be array
      steps,
      cookingTime,
      servings,
      image,
      video
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  const recipes = await Recipe.find({}).populate('user', 'name email');
  res.json(recipes);
};

// Rate recipe
export const rateRecipe = async (req, res) => {
  const { recipeId, rating } = req.body;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const existing = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
  if (existing) existing.rating = rating;
  else recipe.ratings.push({ user: req.user._id, rating });

  await recipe.save();
  res.json({ message: 'Recipe rated successfully' });
};

// Comment recipe
export const commentRecipe = async (req, res) => {
  const { recipeId, comment } = req.body;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  recipe.comments.push({ user: req.user._id, comment });
  await recipe.save();
  res.json({ message: 'Comment added successfully' });
};

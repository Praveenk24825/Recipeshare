import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
}, { timestamps: true });

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [String],
  steps: [String],
  cookingTime: Number,
  servings: Number,
  imageUrl: String,
  videoUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: [ratingSchema],
  comments: [commentSchema],
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;

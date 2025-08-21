import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: [ratingSchema],
  comments: [commentSchema],
}, { timestamps: true });

export default mongoose.model("Recipe", recipeSchema);

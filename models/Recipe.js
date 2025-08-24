import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const ratingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
}, { timestamps: true });

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  cookingTime: { type: String },
  servings: { type: String },
  photo: { type: String },
  video: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [commentSchema],
  ratings: [ratingSchema]
}, { timestamps: true });

export default mongoose.model("Recipe", recipeSchema);

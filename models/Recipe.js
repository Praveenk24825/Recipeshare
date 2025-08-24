import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    cookingTime: { type: String },
    servings: { type: String },
    photo: { type: String }, // saved file path (/uploads/images/xxx.png)
    video: { type: String }, // saved file path (/uploads/videos/xxx.mp4)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema],
    ratings: [ratingSchema],
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;

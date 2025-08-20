import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const recipeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }], // array of strings
  steps: { type: String, required: true },
  cookingTime: { type: Number },
  servings: { type: Number },
  image: { type: String },
  video: { type: String },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    }
  ],
  comments: [commentSchema]
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;

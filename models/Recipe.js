import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String], // Array of strings
      required: true,
    },
    steps: {
      type: [String], // Array of strings
      required: true,
    },
    cookingTime: {
      type: Number, // in minutes
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String, // optional
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);

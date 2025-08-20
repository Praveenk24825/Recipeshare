import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  profilePic: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  mealPlans: [
    {
      name: { type: String, required: true },
      recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      createdAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);

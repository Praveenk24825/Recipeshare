import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("favorites");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update profile
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, password, bio, profilePic } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (bio) user.bio = bio;
  if (profilePic) user.profilePic = profilePic;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();
  res.json({ message: "Profile updated successfully" });
};

// Follow/Unfollow
export const followUser = async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);
  if (!userToFollow) return res.status(404).json({ message: "User not found" });

  if (currentUser.following.includes(userToFollow._id)) {
    currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow._id.toString());
    await currentUser.save();
    return res.json({ message: `Unfollowed ${userToFollow.name}` });
  } else {
    currentUser.following.push(userToFollow._id);
    await currentUser.save();
    return res.json({ message: `Followed ${userToFollow.name}` });
  }
};

// Toggle favorite recipe
export const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipeId = req.params.recipeId;
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.favorites.includes(recipeId)) {
    user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    await user.save();
    return res.json({ message: "Removed from favorites" });
  } else {
    user.favorites.push(recipeId);
    await user.save();
    return res.json({ message: "Added to favorites" });
  }
};

// Get user's favorite recipes
export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.favorites);
};

import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// 👉 Follow/Unfollow a user
export const followUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id.trim(); // Trim whitespace
  const currentUser = await User.findById(req.user._id);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) return res.status(404).json({ message: "User not found" });

  // Ensure following array exists
  if (!currentUser.following) currentUser.following = [];

  const index = currentUser.following.findIndex(id => id.toString() === targetUser._id.toString());
  if (index === -1) currentUser.following.push(targetUser._id); // Follow
  else currentUser.following.splice(index, 1); // Unfollow

  await currentUser.save();

  res.json({
    _id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio || "",
    profilePic: currentUser.profilePic || "",
    following: currentUser.following,
    favorites: currentUser.favorites || [],
  });
});

// 👉 Add/Remove favorite recipe
export const toggleFavorite = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId.trim();
  const user = await User.findById(req.user._id);

  if (!user.favorites) user.favorites = [];

  const index = user.favorites.findIndex(id => id.toString() === recipeId);
  if (index === -1) user.favorites.push(recipeId);
  else user.favorites.splice(index, 1);

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    profilePic: user.profilePic || "",
    following: user.following || [],
    favorites: user.favorites,
  });
});

// 👉 Update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, bio, profilePic } = req.body;
  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (profilePic) user.profilePic = profilePic;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    profilePic: user.profilePic || "",
    following: user.following || [],
    favorites: user.favorites || [],
  });
});

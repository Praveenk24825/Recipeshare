import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});  

// @desc    Follow a user
// @route   PUT /api/users/:id/follow
// @access  Private
export const followUser = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToFollow) {
    res.status(404);
    throw new Error("User not found");
  }

  if (userToFollow._id.equals(currentUser._id)) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }

  if (!userToFollow.followers) userToFollow.followers = [];
  if (!currentUser.following) currentUser.following = [];

  if (!userToFollow.followers.includes(currentUser._id)) {
    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);

    await userToFollow.save();
    await currentUser.save();

    res.json({ message: `You are now following ${userToFollow.name}` });
  } else {
    res.status(400);
    throw new Error("Already following this user");
  }
});

// @desc    Unfollow a user
// @route   PUT /api/users/:id/unfollow
// @access  Private
export const unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToUnfollow) {
    res.status(404);
    throw new Error("User not found");
  }

  if (userToUnfollow._id.equals(currentUser._id)) {
    res.status(400);
    throw new Error("You cannot unfollow yourself");
  }

  userToUnfollow.followers = userToUnfollow.followers?.filter(
    (id) => !id.equals(currentUser._id)
  );
  currentUser.following = currentUser.following?.filter(
    (id) => !id.equals(userToUnfollow._id)
  );

  await userToUnfollow.save();
  await currentUser.save();

  res.json({ message: `You have unfollowed ${userToUnfollow.name}` });
});


// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});  
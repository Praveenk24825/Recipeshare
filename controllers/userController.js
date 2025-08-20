import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("favorites");
  if (user) res.json(user);
  else res.status(404).json({ message: "User not found" });
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.profilePic = req.body.profilePic || user.profilePic;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Follow / Unfollow user
export const followUser = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  const currentUser = await User.findById(req.user._id);
  if (currentUser.following.includes(targetUser._id)) {
    currentUser.following.pull(targetUser._id);
    await currentUser.save();
    res.json({ message: "Unfollowed" });
  } else {
    currentUser.following.push(targetUser._id);
    await currentUser.save();
    res.json({ message: "Followed" });
  }
};

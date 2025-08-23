import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ Follow / Unfollow a user
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: "User not found" });

    if (currentUser.following.includes(userToFollow._id)) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow._id.toString()
      );
      await currentUser.save();
      return res.json({ message: `Unfollowed ${userToFollow.name}` });
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      await currentUser.save();
      return res.json({ message: `Followed ${userToFollow.name}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Toggle favorite recipe
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.recipeId;

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favorites.includes(recipeId)) {
      user.favorites = user.favorites.filter((id) => id.toString() !== recipeId);
      await user.save();
      return res.json({ message: "Removed from favorites" });
    } else {
      user.favorites.push(recipeId);
      await user.save();
      return res.json({ message: "Added to favorites" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update profile
export const updateProfile = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user's favorite recipes
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

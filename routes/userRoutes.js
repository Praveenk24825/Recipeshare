import express from "express";
import { getUserProfile, updateUserProfile, followUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/follow/:id", protect, followUser);

export default router;

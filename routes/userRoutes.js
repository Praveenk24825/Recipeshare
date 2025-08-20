import express from 'express';
const router = express.Router();
import { registerUser, authUser } from '../controllers/userController.js';

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', authUser);

export default router;

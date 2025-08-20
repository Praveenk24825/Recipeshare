import express from 'express';
const router = express.Router();
import { registerUser, authUser } from '../controllers/userController.js';

// Register
router.post('/register', registerUser);

// Login
router.post('/login', authUser);

export default router;

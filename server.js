import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mealplans', mealPlanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));

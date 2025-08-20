import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  recipes: [{
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
    mealType: { type: String, enum: ['Breakfast','Lunch','Dinner','Snack'], required: true }
  }]
}, { timestamps: true });

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlan;

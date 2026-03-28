import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';
import mealPlanRoutes from './routes/mealPlanRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://recipe-app-tau-gold-49.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplan', mealPlanRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
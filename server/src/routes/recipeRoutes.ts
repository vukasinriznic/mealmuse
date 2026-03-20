import { Router } from 'express';
import { searchRecipes, getRecipeById, toggleFavorite, getFavorites } from '../controllers/recipeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/search', searchRecipes);
router.get('/favorites/list', authMiddleware, getFavorites);
router.post('/favorites/toggle', authMiddleware, toggleFavorite);
router.get('/:id', getRecipeById);

export default router;
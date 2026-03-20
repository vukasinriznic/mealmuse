import { Router } from 'express';
import { getMealPlan, addToMealPlan, removeFromMealPlan } from '../controllers/mealPlanController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getMealPlan);
router.post('/', authMiddleware, addToMealPlan);
router.delete('/:id', authMiddleware, removeFromMealPlan);

export default router;
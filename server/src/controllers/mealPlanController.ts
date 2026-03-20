import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMealPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const { startDate, endDate } = req.query;

    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      orderBy: { date: 'asc' },
    });

    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToMealPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const { date, mealType, recipeId } = req.body;

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId,
        date: new Date(date),
        mealType,
        recipeId,
      },
    });

    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromMealPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;
    const { id } = req.params;

    const mealPlan = await prisma.mealPlan.findFirst({
      where: { id: parseInt(id as string), userId },
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    await prisma.mealPlan.delete({ where: { id: parseInt(id as string) } });

    res.json({ message: 'Removed from meal plan' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
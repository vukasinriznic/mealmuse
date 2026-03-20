import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

export const searchRecipes = async (req: Request, res: Response) => {
  try {
    const { query, cuisine, diet, number = 12 } = req.query;

    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY as string,
      number: number as string,
      addRecipeInformation: 'true',
      ...(query && { query: query as string }),
      ...(cuisine && { cuisine: cuisine as string }),
      ...(diet && { diet: diet as string }),
    });

    const response = await fetch(`${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { recipeId } = req.body;
    const userId = req.userId as number;

    const existing = await prisma.favorite.findFirst({
      where: { userId, recipeId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ message: 'Removed from favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: { userId, recipeId },
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as number;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
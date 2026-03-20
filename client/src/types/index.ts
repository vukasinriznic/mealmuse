export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  cuisines: string[];
  diets: string[];
  summary: string;
  instructions: string;
  extendedIngredients: Ingredient[];
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}

export interface MealPlan {
  id: number;
  userId: number;
  date: string;
  mealType: string;
  recipeId: number;
}

export interface Favorite {
  id: number;
  userId: number;
  recipeId: number;
}
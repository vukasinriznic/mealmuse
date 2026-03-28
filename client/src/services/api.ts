import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data: { email: string; password: string; name: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

// Recipes
export const searchRecipes = (params: { query?: string; cuisine?: string; diet?: string; number?: number }) =>
  api.get('/recipes/search', { params });

export const getRecipeById = (id: number) =>
  api.get(`/recipes/${id}`);

// Favorites
export const toggleFavorite = (recipeId: number) =>
  api.post('/recipes/favorites/toggle', { recipeId });

export const getFavorites = () =>
  api.get('/recipes/favorites/list');

// Meal Plan
export const getMealPlan = (startDate: string, endDate: string) =>
  api.get('/mealplan', { params: { startDate, endDate } });

export const addToMealPlan = (data: { date: string; mealType: string; recipeId: number }) =>
  api.post('/mealplan', data);

export const removeFromMealPlan = (id: number) =>
  api.delete(`/mealplan/${id}`);

export default api;
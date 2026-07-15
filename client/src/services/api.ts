import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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

// Cold-start retry — Render free tier sleeps after 15 min inactivity.
// During wake-up (~25-50s), it returns a 502/503 or its own HTML page.
// We retry with backoff instead of failing immediately.

const RETRY_DELAYS_MS = [4000, 6000, 8000, 10000, 12000, 15000]; // ~55s max

type RetryConfig = InternalAxiosRequestConfig & { _retryCount?: number };

// Tracks whether a retry is in progress so we only emit 'false' after we were active.
let _wakeupActive = false;

const emitWakeup = (active: boolean, attempt = 0) => {
  if (!active && !_wakeupActive) return;
  _wakeupActive = active;
  window.dispatchEvent(new CustomEvent('server:wakeup', { detail: { active, attempt } }));
};

const isColdStart = (status?: number, contentType?: string): boolean => {
  if (status == null) return true; // network error / no response
  if (status === 502 || status === 503) return true;
  if (contentType?.includes('text/html')) return true;
  return false;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRetry(error: AxiosError): Promise<any> {
  const config = error.config as RetryConfig | undefined;
  if (!config) return Promise.reject(error);

  config._retryCount = (config._retryCount ?? 0) + 1;

  if (config._retryCount > RETRY_DELAYS_MS.length) {
    emitWakeup(false);
    return Promise.reject(error);
  }

  emitWakeup(true, config._retryCount);
  await sleep(RETRY_DELAYS_MS[config._retryCount - 1]);
  return api.request(config);
}

api.interceptors.response.use(
  (response) => {
    const ct = String(response.headers['content-type'] ?? '');
    // Render sometimes returns its HTML boot page with a 2xx status
    if (ct.includes('text/html')) {
      return handleRetry(
        new AxiosError('Server starting', 'ERR_WAKEUP', response.config, response.request, response)
      );
    }
    emitWakeup(false);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const ct = String(error.response?.headers['content-type'] ?? '');
    if (isColdStart(status, ct)) {
      return handleRetry(error);
    }
    return Promise.reject(error);
  }
);

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

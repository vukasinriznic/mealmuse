import { useState, useEffect } from 'react';
import { getMealPlan, getRecipeById } from '../services/api';
import { Ingredient } from '../types';
import { ShoppingCart, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const getWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

const ShoppingListPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadShoppingList = async () => {
    try {
      const weekDates = getWeekDates();
      const startDate = weekDates[0].toISOString();
      const endDate = weekDates[6].toISOString();

      const mealPlanRes = await getMealPlan(startDate, endDate);
      const mealPlans = mealPlanRes.data;

      if (mealPlans.length === 0) {
        setIngredients([]);
        setLoading(false);
        return;
      }

      const uniqueRecipeIds = [...new Set(mealPlans.map((mp: { recipeId: number }) => mp.recipeId))];
      const recipePromises = uniqueRecipeIds.map((id) => getRecipeById(id as number));
      const recipes = await Promise.all(recipePromises);

      const allIngredients: Ingredient[] = [];
      recipes.forEach((r) => {
        if (r.data.extendedIngredients) {
          allIngredients.push(...r.data.extendedIngredients);
        }
      });

      const merged = allIngredients.reduce((acc: Ingredient[], curr) => {
        const existing = acc.find((i) => i.name.toLowerCase() === curr.name.toLowerCase());
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, []);

      setIngredients(merged);
    } catch (error) {
      toast.error('Error loading shopping list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingList();
  }, []);

  const toggleCheck = (name: string) => {
    const newChecked = new Set(checked);
    if (newChecked.has(name)) {
      newChecked.delete(name);
    } else {
      newChecked.add(name);
    }
    setChecked(newChecked);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading shopping list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping List</h1>
      <p className="text-gray-500 mb-6">Ingredients for this week's meal plan</p>

      {ingredients.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No ingredients yet.</p>
          <p className="text-gray-400">Add recipes to your meal plan first!</p>
        </div>
      )}

      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            onClick={() => toggleCheck(ingredient.name)}
            className={`flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm cursor-pointer transition hover:shadow-md ${
              checked.has(ingredient.name) ? 'opacity-50' : ''
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
              checked.has(ingredient.name)
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300'
            }`}>
              {checked.has(ingredient.name) && <Check size={14} className="text-white" />}
            </div>
            <span className={`flex-1 font-medium text-gray-700 ${
              checked.has(ingredient.name) ? 'line-through' : ''
            }`}>
              {ingredient.name}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(ingredient.amount * 10) / 10} {ingredient.unit}
            </span>
          </div>
        ))}
      </div>

      {ingredients.length > 0 && (
        <p className="text-center text-gray-400 mt-6 text-sm">
          {checked.size}/{ingredients.length} items checked
        </p>
      )}
    </div>
  );
};

export default ShoppingListPage;
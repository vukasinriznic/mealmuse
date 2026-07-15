import { useState, useEffect } from 'react';
import { getMealPlan, getRecipeById } from '../services/api';
import { Ingredient } from '../types';
import { ShoppingCart, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

const ShoppingListPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [checked, setChecked] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('shoppingListChecked');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [loading, setLoading] = useState(true);

  const loadShoppingList = async () => {
    setLoading(true);
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
    localStorage.setItem('shoppingListChecked', JSON.stringify([...newChecked]));
  };

  const uncheckedItems = ingredients.filter((i) => !checked.has(i.name));
  const checkedItems = ingredients.filter((i) => checked.has(i.name));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a45 50%, #2d9e5f 100%)' }}
      >
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="max-w-2xl mx-auto relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart size={28} className="text-green-300" />
              <h1 className="text-3xl font-bold text-white">Shopping List</h1>
            </div>
            <p className="text-green-200">Ingredients for this week's meal plan</p>
          </div>
          <button
            onClick={loadShoppingList}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <RefreshCw size={16} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {ingredients.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(22, 163, 74, 0.08)' }}
            >
              <ShoppingCart size={36} className="text-green-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No ingredients yet</p>
            <p className="text-gray-400 text-sm mt-1">Add recipes to your meal plan first!</p>
          </div>
        )}

        {ingredients.length > 0 && (
          <>
            {/* Progress bar */}
            <div className="mb-6 p-4 rounded-2xl" style={{ background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-bold text-green-600">{checkedItems.length}/{ingredients.length}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(checked.size / ingredients.length) * 100}%`,
                    background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                  }}
                />
              </div>
            </div>

            {/* Unchecked items */}
            {uncheckedItems.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  To Buy ({uncheckedItems.length})
                </h3>
                <div className="space-y-2">
                  {uncheckedItems.map((ingredient, index) => (
                    <div
                      key={index}
                      onClick={() => toggleCheck(ingredient.name)}
                      className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md"
                      style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      <span className="flex-1 text-sm font-medium text-gray-700">{ingredient.name}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        {Math.round(ingredient.amount * 10) / 10} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checked items */}
            {checkedItems.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Done ({checkedItems.length})
                </h3>
                <div className="space-y-2">
                  {checkedItems.map((ingredient, index) => (
                    <div
                      key={index}
                      onClick={() => toggleCheck(ingredient.name)}
                      className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all opacity-50"
                      style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                      >
                        <Check size={14} className="text-white" />
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-500 line-through">{ingredient.name}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        {Math.round(ingredient.amount * 10) / 10} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
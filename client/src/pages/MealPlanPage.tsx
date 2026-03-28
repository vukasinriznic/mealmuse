import { useState, useEffect } from 'react';
import { getMealPlan, addToMealPlan, removeFromMealPlan, searchRecipes, getRecipeById } from '../services/api';
import { MealPlan, Recipe } from '../types';
import { Plus, Trash2, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

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

const MealPlanPage = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipeNames, setRecipeNames] = useState<Record<number, string>>({});
  const [recipeImages, setRecipeImages] = useState<Record<number, string>>({});
  const [weekDates] = useState(getWeekDates());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [recipeQuery, setRecipeQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMealPlan = async () => {
    try {
      const startDate = weekDates[0].toISOString();
      const endDate = weekDates[6].toISOString();
      const res = await getMealPlan(startDate, endDate);
      const plans: MealPlan[] = res.data;
      setMealPlans(plans);

      const uniqueIds = [...new Set(plans.map((mp) => mp.recipeId))];
      const names: Record<number, string> = {};
      const images: Record<number, string> = {};

      await Promise.all(
        uniqueIds.map(async (id) => {
          const r = await getRecipeById(id);
          names[id] = r.data.title;
          images[id] = r.data.image;
        })
      );

      setRecipeNames(names);
      setRecipeImages(images);
    } catch (error) {
      toast.error('Error loading meal plan');
    }
  };

  useEffect(() => {
    loadMealPlan();
  }, []);

  const handleSearch = async () => {
    if (!recipeQuery) return;
    setLoading(true);
    try {
      const res = await searchRecipes({ query: recipeQuery, number: 6 });
      setSearchResults(res.data.results || []);
    } catch (error) {
      toast.error('Error searching recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (recipe: Recipe) => {
    try {
      await addToMealPlan({
        date: selectedDate,
        mealType: selectedMealType,
        recipeId: recipe.id,
      });
      toast.success('Added to meal plan!');
      setShowModal(false);
      setSearchResults([]);
      setRecipeQuery('');
      loadMealPlan();
    } catch (error) {
      toast.error('Error adding to meal plan');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFromMealPlan(id);
      toast.success('Removed from meal plan');
      loadMealPlan();
    } catch (error) {
      toast.error('Error removing meal');
    }
  };

  const getMealsForSlot = (date: Date, mealType: string) => {
    return mealPlans.filter((mp) => {
      const mpDate = new Date(mp.date);
      return mpDate.toDateString() === date.toDateString() && mp.mealType === mealType;
    });
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();

  const mealTypeColors: Record<string, string> = {
    Breakfast: 'rgba(251, 191, 36, 0.1)',
    Lunch: 'rgba(34, 197, 94, 0.1)',
    Dinner: 'rgba(99, 102, 241, 0.1)',
  };

  const mealTypeBorders: Record<string, string> = {
    Breakfast: 'rgba(251, 191, 36, 0.3)',
    Lunch: 'rgba(34, 197, 94, 0.3)',
    Dinner: 'rgba(99, 102, 241, 0.3)',
  };

  const mealTypeTextColors: Record<string, string> = {
    Breakfast: '#d97706',
    Lunch: '#16a34a',
    Dinner: '#6366f1',
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a45 50%, #2d9e5f 100%)' }}
      >
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={28} className="text-green-300" />
            <h1 className="text-3xl font-bold text-white">Weekly Meal Plan</h1>
          </div>
          <p className="text-green-200">Plan your meals for the week</p>
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex items-center gap-4">
        {MEAL_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: mealTypeTextColors[type] }} />
            <span className="text-xs text-gray-500 font-medium">{type}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: 'rgba(22, 163, 74, 0.04)' }}>
                  <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-24 border-b border-gray-100">
                    Meal
                  </th>
                  {weekDates.map((date, i) => {
                    const isToday = date.toDateString() === today.toDateString();
                    return (
                      <th key={i} className="p-4 text-center border-b border-gray-100 border-l">
                        <div className={`text-sm font-semibold ${isToday ? 'text-green-600' : 'text-gray-600'}`}>
                          {dayNames[i]}
                        </div>
                        <div className={`text-xs mt-1 w-6 h-6 rounded-full flex items-center justify-center mx-auto font-medium
                          ${isToday ? 'text-white' : 'text-gray-400'}`}
                          style={isToday ? { background: 'linear-gradient(135deg, #16a34a, #15803d)' } : {}}
                        >
                          {date.getDate()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {MEAL_TYPES.map((mealType) => (
                  <tr key={mealType} className="border-t border-gray-50">
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg"
                        style={{
                          background: mealTypeColors[mealType],
                          color: mealTypeTextColors[mealType],
                        }}
                      >
                        {mealType}
                      </span>
                    </td>
                    {weekDates.map((date, i) => {
                      const meals = getMealsForSlot(date, mealType);
                      return (
                        <td key={i} className="p-2 align-top border-l border-gray-50">
                          <div className="min-h-20 space-y-1">
                            {meals.map((meal) => (
                              <div
                                key={meal.id}
                                className="rounded-xl overflow-hidden border"
                                style={{
                                  background: mealTypeColors[mealType],
                                  borderColor: mealTypeBorders[mealType],
                                }}
                              >
                                {recipeImages[meal.recipeId] && (
                                  <img
                                    src={recipeImages[meal.recipeId]}
                                    alt={recipeNames[meal.recipeId]}
                                    className="w-full h-14 object-cover"
                                  />
                                )}
                                <div className="p-1.5 flex items-start justify-between gap-1">
                                  <span className="text-xs font-medium line-clamp-2"
                                    style={{ color: mealTypeTextColors[mealType] }}
                                  >
                                    {recipeNames[meal.recipeId] || `Recipe #${meal.recipeId}`}
                                  </span>
                                  <button
                                    onClick={() => handleRemove(meal.id)}
                                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                                  >
                                    <Trash2 size={11} className="text-red-400" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setSelectedDate(date.toISOString());
                                setSelectedMealType(mealType);
                                setShowModal(true);
                              }}
                              className="w-full border border-dashed rounded-xl p-1.5 text-gray-300 hover:text-green-500 hover:border-green-400 transition-all"
                            >
                              <Plus size={14} className="mx-auto" />
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Recipe Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={() => { setShowModal(false); setSearchResults([]); setRecipeQuery(''); }}
        >
          <div
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: 'white', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #0f4c2a, #1a7a45)' }}
            >
              <div>
                <h2 className="text-lg font-semibold text-white">Add to {selectedMealType}</h2>
                <p className="text-green-200 text-sm mt-0.5">Search and select a recipe</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setSearchResults([]); setRecipeQuery(''); }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={recipeQuery}
                  onChange={(e) => setRecipeQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search recipes..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                >
                  Search
                </button>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              )}

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {searchResults.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleAddMeal(recipe)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-green-50 border border-transparent hover:border-green-200"
                  >
                    <img src={recipe.image} alt={recipe.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 line-clamp-2">{recipe.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{recipe.readyInMinutes} min · {recipe.servings} servings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanPage;
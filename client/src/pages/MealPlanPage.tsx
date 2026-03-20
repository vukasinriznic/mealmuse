import { useState, useEffect } from 'react';
import { getMealPlan, addToMealPlan, removeFromMealPlan, searchRecipes, getRecipeById } from '../services/api';
import { MealPlan, Recipe } from '../types';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

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
      setSearchResults(res.data.results);
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
      return (
        mpDate.toDateString() === date.toDateString() &&
        mp.mealType === mealType
      );
    });
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Weekly Meal Plan</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-gray-500 font-medium w-24">Meal</th>
              {weekDates.map((date, i) => (
                <th key={i} className="p-3 text-center text-gray-700 font-medium">
                  <div>{dayNames[i]}</div>
                  <div className="text-sm text-gray-400">{date.getDate()}/{date.getMonth() + 1}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((mealType) => (
              <tr key={mealType} className="border-t border-gray-100">
                <td className="p-3 font-medium text-gray-600">{mealType}</td>
                {weekDates.map((date, i) => {
                  const meals = getMealsForSlot(date, mealType);
                  return (
                    <td key={i} className="p-2 align-top border-l border-gray-100">
                      <div className="min-h-16 space-y-1">
                        {meals.map((meal) => (
                          <div key={meal.id} className="bg-green-50 border border-green-200 rounded-lg p-2">
                            {recipeImages[meal.recipeId] && (
                              <img
                                src={recipeImages[meal.recipeId]}
                                alt={recipeNames[meal.recipeId]}
                                className="w-full h-16 object-cover rounded-md mb-1"
                              />
                            )}
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs text-green-800 font-medium line-clamp-2">
                                {recipeNames[meal.recipeId] || `Recipe #${meal.recipeId}`}
                              </span>
                              <button onClick={() => handleRemove(meal.id)}>
                                <Trash2 size={12} className="text-red-400 hover:text-red-600 flex-shrink-0" />
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
                          className="w-full border border-dashed border-gray-300 rounded-lg p-1 text-gray-400 hover:border-green-500 hover:text-green-500 transition"
                        >
                          <Plus size={16} className="mx-auto" />
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add Recipe to {selectedMealType}</h2>
              <button onClick={() => { setShowModal(false); setSearchResults([]); setRecipeQuery(''); }}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
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
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Search
                </button>
              </div>

              {loading && <p className="text-center text-gray-500">Searching...</p>}

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {searchResults.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleAddMeal(recipe)}
                    className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg cursor-pointer transition"
                  >
                    <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-sm font-medium text-gray-700">{recipe.title}</span>
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
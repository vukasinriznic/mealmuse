import { useState } from 'react';
import { searchRecipes, toggleFavorite } from '../services/api';
import { Recipe } from '../types';
import { Heart, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import RecipeModal from '../components/RecipeModal';

const RecipesPage = () => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchRecipes({ query, cuisine, diet, number: 12 });
      setRecipes(res.data.results || []);
    } catch (error) {
      toast.error('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation();
    try {
      await toggleFavorite(recipeId);
      toast.success('Favorites updated!');
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Recipes</h1>

      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1 min-w-48 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Cuisines</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="asian">Asian</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="american">American</option>
        </select>
        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
          <option value="ketogenic">Ketogenic</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Searching recipes...</p>
        </div>
      )}

      {!loading && recipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Search for recipes to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipeId(recipe.id)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <div className="relative">
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
              <button
                onClick={(e) => handleFavorite(e, recipe.id)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
              >
                <Heart size={18} className="text-red-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{recipe.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {recipe.readyInMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {recipe.servings} servings
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </div>
  );
};

export default RecipesPage;
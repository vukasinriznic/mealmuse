import { useState, useEffect } from 'react';
import { getFavorites, getRecipeById, toggleFavorite } from '../services/api';
import { Recipe } from '../types';
import { Heart, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      const favoriteIds = res.data.map((f: { recipeId: number }) => f.recipeId);

      const recipePromises = favoriteIds.map((id: number) => getRecipeById(id));
      const recipeResults = await Promise.all(recipePromises);
      setRecipes(recipeResults.map((r) => r.data));
    } catch (error) {
      toast.error('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId: number) => {
    try {
      await toggleFavorite(recipeId);
      toast.success('Removed from favorites');
      setRecipes(recipes.filter((r) => r.id !== recipeId));
    } catch (error) {
      toast.error('Error removing favorite');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favorites</h1>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No favorites yet. Start adding some!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="relative">
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
              <button
                onClick={() => handleRemoveFavorite(recipe.id)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
              >
                <Heart size={18} className="text-red-500 fill-red-500" />
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
    </div>
  );
};

export default FavoritesPage;
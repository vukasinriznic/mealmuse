import { useState, useEffect } from 'react';
import { getFavorites, getRecipeById, toggleFavorite } from '../services/api';
import { Recipe } from '../types';
import { Heart, Clock, Users, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import RecipeModal from '../components/RecipeModal';

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

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

  const handleRemoveFavorite = async (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation();
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading favorites...</p>
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
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={28} className="text-green-300" />
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-green-200">
            {recipes.length > 0 ? `${recipes.length} saved recipes` : 'No favorites yet'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {recipes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(22, 163, 74, 0.08)' }}
            >
              <Heart size={36} className="text-green-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No favorites yet</p>
            <p className="text-gray-400 text-sm mt-1">Start adding recipes you love!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipeId(recipe.id)}
              className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
              style={{ background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <button
                  onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 leading-snug">{recipe.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-green-500" />
                    {recipe.readyInMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-green-500" />
                    {recipe.servings} servings
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default FavoritesPage;
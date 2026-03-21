import { useEffect, useState } from 'react';
import { getRecipeById, toggleFavorite } from '../services/api';
import { Recipe } from '../types';
import { X, Clock, Users, Heart, ChefHat, ShoppingBasket } from 'lucide-react';
import toast from 'react-hot-toast';

interface RecipeModalProps {
  recipeId: number;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: RecipeModalProps) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getRecipeById(recipeId);
        setRecipe(res.data);
      } catch {
        toast.error('Error loading recipe');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [recipeId]);

  const handleFavorite = async () => {
    try {
      await toggleFavorite(recipeId);
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites!');
    } catch {
      toast.error('Error updating favorites');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'white',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-400">Loading recipe...</p>
          </div>
        ) : recipe ? (
          <>
            {/* Hero Image */}
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-t-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-3xl" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
              >
                <X size={20} className="text-gray-700" />
              </button>

              {/* Favorite button */}
              <button
                onClick={handleFavorite}
                className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
              >
                <Heart size={20} className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white leading-tight">{recipe.title}</h2>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(22, 163, 74, 0.08)' }}
              >
                <Clock size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">{recipe.readyInMinutes} min</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(22, 163, 74, 0.08)' }}
              >
                <Users size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">{recipe.servings} servings</span>
              </div>
              {recipe.diets?.slice(0, 2).map((diet) => (
                <span key={diet} className="px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: 'rgba(22, 163, 74, 0.08)', color: '#16a34a' }}
                >
                  {diet}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              <button
                onClick={() => setActiveTab('ingredients')}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2"
                style={{
                  borderColor: activeTab === 'ingredients' ? '#16a34a' : 'transparent',
                  color: activeTab === 'ingredients' ? '#16a34a' : '#9ca3af',
                }}
              >
                <ShoppingBasket size={16} />
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2"
                style={{
                  borderColor: activeTab === 'instructions' ? '#16a34a' : 'transparent',
                  color: activeTab === 'instructions' ? '#16a34a' : '#9ca3af',
                }}
              >
                <ChefHat size={16} />
                Instructions
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'ingredients' && (
                <ul className="space-y-2">
                  {recipe.extendedIngredients?.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#16a34a' }} />
                      <span className="text-gray-700 text-sm">{ing.original}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'instructions' && (
                <div>
                  {recipe.instructions ? (
                    <div
                      className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <ChefHat size={36} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400">No instructions available for this recipe.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 p-8">Recipe not found</p>
        )}
      </div>
    </div>
  );
};

export default RecipeModal;
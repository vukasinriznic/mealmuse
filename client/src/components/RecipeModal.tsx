import { useEffect, useState } from 'react';
import { getRecipeById } from '../services/api';
import { Recipe } from '../types';
import { X, Clock, Users, Heart } from 'lucide-react';
import { toggleFavorite } from '../services/api';
import toast from 'react-hot-toast';

interface RecipeModalProps {
  recipeId: number;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: RecipeModalProps) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : recipe ? (
          <>
            <div className="relative">
              <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-t-2xl" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:scale-110 transition"
              >
                <X size={20} className="text-gray-700" />
              </button>
              <button
                onClick={handleFavorite}
                className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:scale-110 transition"
              >
                <Heart size={20} className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{recipe.title}</h2>

              <div className="flex items-center gap-6 mb-4">
                <span className="flex items-center gap-2 text-gray-500">
                  <Clock size={18} className="text-green-600" />
                  {recipe.readyInMinutes} minutes
                </span>
                <span className="flex items-center gap-2 text-gray-500">
                  <Users size={18} className="text-green-600" />
                  {recipe.servings} servings
                </span>
              </div>

              {recipe.diets && recipe.diets.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.diets.map((diet) => (
                    <span key={diet} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      {diet}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h3>
              <ul className="space-y-1 mb-6">
                {recipe.extendedIngredients?.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    {ing.original}
                  </li>
                ))}
              </ul>

              {recipe.instructions && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
                  <div
                    className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                </>
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
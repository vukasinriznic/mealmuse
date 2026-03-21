import { useState, useEffect } from 'react';
import { searchRecipes, toggleFavorite } from '../services/api';
import { Recipe } from '../types';
import { Heart, Clock, Users, Search, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import RecipeModal from '../components/RecipeModal';

const RecipesPage = () => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [favorited, setFavorited] = useState<Set<number>>(new Set());

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
      setFavorited((prev) => {
        const next = new Set(prev);
        if (next.has(recipeId)) {
          next.delete(recipeId);
          toast.success('Removed from favorites');
        } else {
          next.add(recipeId);
          toast.success('Added to favorites!');
        }
        return next;
      });
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  useEffect(() => {
    const loadPopular = async () => {
        setLoading(true);
        try {
        const queries = ['chicken', 'pasta', 'salad', 'soup'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const res = await searchRecipes({ query: randomQuery, number: 12 });
        setRecipes(res.data.results || []);
        } catch (error) {
        console.error('Error loading popular recipes');
        } finally {
        setLoading(false);
        }
    };
    loadPopular();
    }, []);

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Hero search section */}
      <div className="relative py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a45 50%, #2d9e5f 100%)' }}
      >
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute bottom-[-30px] left-[10%] w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat size={28} className="text-green-300" />
            <h1 className="text-3xl font-bold text-white">Find Recipes</h1>
          </div>
          <p className="text-green-200 mb-6">Search from thousands of delicious recipes</p>

          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              />
            </div>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
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
              className="px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            >
              <option value="">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten free">Gluten Free</option>
              <option value="ketogenic">Ketogenic</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)',
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Searching recipes...</p>
          </div>
        )}

        {!loading && recipes.length === 0 && (
            <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(22, 163, 74, 0.08)' }}
                >
                <ChefHat size={36} className="text-green-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No recipes found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            </div>
            )}

            {!loading && recipes.length > 0 && (
                <h2 className="text-xl font-semibold text-gray-700 mb-6">
                    {query ? `Results for "${query}"` : '🔥 Popular Recipes'}
                </h2>
                )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipeId(recipe.id)}
              className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
              style={{
                background: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <button
                  onClick={(e) => handleFavorite(e, recipe.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Heart
                    size={16}
                    className={favorited.has(recipe.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                  />
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

export default RecipesPage;
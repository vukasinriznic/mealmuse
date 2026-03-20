import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { UtensilsCrossed, Calendar, Heart, ShoppingCart, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/recipes" className="flex items-center gap-2 text-green-600 font-bold text-xl">
          <UtensilsCrossed size={24} />
          Recipe App
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/recipes" className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition">
            <UtensilsCrossed size={18} />
            <span className="hidden md:block">Recipes</span>
          </Link>
          <Link to="/meal-plan" className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition">
            <Calendar size={18} />
            <span className="hidden md:block">Meal Plan</span>
          </Link>
          <Link to="/favorites" className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition">
            <Heart size={18} />
            <span className="hidden md:block">Favorites</span>
          </Link>
          <Link to="/shopping-list" className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition">
            <ShoppingCart size={18} />
            <span className="hidden md:block">Shopping</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-600 hidden md:block">Hi, {user?.name}!</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
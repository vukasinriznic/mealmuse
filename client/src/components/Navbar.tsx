import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { UtensilsCrossed, Calendar, Heart, ShoppingCart, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: '/recipes', icon: <UtensilsCrossed size={18} />, label: 'Recipes' },
    { to: '/meal-plan', icon: <Calendar size={18} />, label: 'Meal Plan' },
    { to: '/favorites', icon: <Heart size={18} />, label: 'Favorites' },
    { to: '/shopping-list', icon: <ShoppingCart size={18} />, label: 'Shopping' },
  ];

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/recipes" className="flex items-center gap-2 font-bold text-xl"
          style={{ color: '#16a34a' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            <UtensilsCrossed size={18} className="text-white" />
          </div>
          <span className="hidden md:block">MealMuse</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
                style={{
                  background: isActive ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                  color: isActive ? '#16a34a' : '#6b7280',
                }}
              >
                {link.icon}
                <span className="hidden md:block text-sm">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(22, 163, 74, 0.08)' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
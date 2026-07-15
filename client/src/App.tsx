import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/authContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipesPage from './pages/RecipesPage';
import FavoritesPage from './pages/FavoritesPage';
import MealPlanPage from './pages/MealPlanPage';
import ShoppingListPage from './pages/ShoppingListPage';
import Footer from './components/Footer';

const WakeupBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setVisible((e as CustomEvent<{ active: boolean }>).detail.active);
    };
    window.addEventListener('server:wakeup', handler);
    return () => window.removeEventListener('server:wakeup', handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a45 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '14px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <div className="animate-spin rounded-full border-2 border-green-300 border-t-white"
        style={{ width: 16, height: 16, flexShrink: 0 }}
      />
      <span>Pokrećem server... (~30s)</span>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/meal-plan" element={<PrivateRoute><MealPlanPage /></PrivateRoute>} />
          <Route path="/shopping-list" element={<PrivateRoute><ShoppingListPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/recipes" />} />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
        <WakeupBanner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
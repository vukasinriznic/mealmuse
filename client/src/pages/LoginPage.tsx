import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { UtensilsCrossed, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/recipes');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a45 40%, #2d9e5f 70%, #0f4c2a 100%)'
      }}
    >
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #bbf7d0, transparent)' }} />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          padding: '48px',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <UtensilsCrossed size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">MealMuse</h1>
          <p className="text-green-200 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              boxShadow: '0 4px 20px rgba(22, 163, 74, 0.4)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-green-200 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
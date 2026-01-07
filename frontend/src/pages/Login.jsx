import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const location = useLocation();
  const successMessage = location.state?.message;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-96 border border-slate-700">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400">Sign in to your LMS account</p>
      </div>
      
      {successMessage && (
        <div className="bg-green-900 text-green-100 p-3 rounded-lg mb-4 border border-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-4 border border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-slate-300 mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 transition font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
          Register
        </Link>
      </p>
    </div>
  </div>
);
}
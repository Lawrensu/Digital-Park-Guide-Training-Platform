import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

// Login page with email and password validation
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        // Mock Admin credentials
        if (email === 'admin@park.com' && password === 'admin123') {
          localStorage.setItem('user', JSON.stringify({ email, role: 'admin', name: 'System Admin' }));
          navigate('/admin/dashboard');
        } else {
          // Store user in localStorage (mock authentication)
          localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
          navigate('/dashboard');
        }
        setIsLoading(false);
      }, 1000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full opacity-10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-10 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
            Park Guide Academy
          </h1>
          <p className="text-gray-600 text-lg">
            Master the art of nature guiding
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-soft">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
            Access Portal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember and Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-green-700 hover:text-green-800 font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Accessing...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            New guide applicant?{' '}
            <Link to="/register" className="text-green-700 hover:text-green-800 font-semibold">
              Apply Now
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-[10px] font-bold text-blue-900 uppercase">Guide Login</p>
            <p className="text-[10px] text-blue-800 font-mono">guide@example.com / password123</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-[10px] font-bold text-purple-900 uppercase">Admin Login</p>
            <p className="text-[10px] text-purple-800 font-mono">admin@park.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

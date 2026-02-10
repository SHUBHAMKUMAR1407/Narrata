import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Show success modal
      setShowSuccess(true);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: error.message || 'Failed to create account' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-premium-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-teal-500/10 relative z-10 border border-teal-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold font-serif text-premium-text">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-premium-slate">
            Or{' '}
            <Link to="/login" className="font-medium text-premium-gold hover:text-premium-gold-light transition-colors">
              sign in to your account
            </Link>
          </p>
        </div>

        {/* Error Messages */}
        {(authError || errors.submit) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {authError || errors.submit}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`appearance-none rounded-t-lg relative block w-full px-3 py-3 border ${errors.name ? 'border-red-300' : 'border-teal-200'
                  } placeholder-gray-400 text-premium-text rounded-t-lg focus:outline-none focus:ring-premium-gold focus:border-premium-gold focus:z-10 sm:text-sm bg-teal-50/30 transition-colors`}
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none relative block w-full px-3 py-3 border ${errors.email ? 'border-red-300' : 'border-teal-200'
                  } placeholder-gray-400 text-premium-text focus:outline-none focus:ring-premium-gold focus:border-premium-gold focus:z-10 sm:text-sm bg-teal-50/30 transition-colors`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none relative block w-full px-3 py-3 border ${errors.password ? 'border-red-300' : 'border-teal-200'
                  } placeholder-gray-400 text-premium-text focus:outline-none focus:ring-premium-gold focus:border-premium-gold focus:z-10 sm:text-sm bg-teal-50/30 transition-colors`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none rounded-b-lg relative block w-full px-3 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-teal-200'
                  } placeholder-gray-400 text-premium-text rounded-b-lg focus:outline-none focus:ring-premium-gold focus:border-premium-gold focus:z-10 sm:text-sm bg-teal-50/30 transition-colors`}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold font-serif rounded-full text-white bg-gold-gradient hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-teal-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-teal-200 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-gold transition-colors"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Sign up with Google
            </button>
          </div>
        </form>
      </div>

      {/* Classic Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-premium-dark/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-premium-gold/30 p-8 max-w-md w-full text-center relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-premium-gold to-teal-400"></div>

            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-teal-50 mb-6 border-2 border-teal-100">
              <CheckCircleIcon className="h-12 w-12 text-premium-gold" />
            </div>

            <h3 className="text-3xl font-bold font-serif text-premium-text mb-4">
              Welcome to Narrata
            </h3>

            <p className="text-premium-slate mb-8">
              Your account has been successfully created. Join our community of storytellers and start your journey.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-6 rounded-full bg-gold-gradient text-white font-bold font-serif shadow-lg hover:shadow-xl hover:shadow-premium-gold/20 transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;

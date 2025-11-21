import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Warn before leaving if form has data
  useEffect(() => {
    const hasFormData = formData.email || formData.password || formData.firstName || formData.confirmPassword;
    
    const handleBeforeUnload = (e) => {
      if (isOpen && hasFormData) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isOpen, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (isLogin) {
      // Login
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error.message);
      } else {
        onClose();
      }
    } else {
      // Sign up - validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const { data, error } = await signUp(
        formData.email, 
        formData.password, 
        formData.firstName
      );
      
      if (error) {
        setError(error.message);
      } else if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists');
      } else {
        setMessage('Check your email to confirm your account!');
        // Optionally close after a delay
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
    // Google OAuth will redirect, so no need to close modal
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    setError('');
    setMessage('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ firstName: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          {/* Blurred backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Modal card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-white/50"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLogin ? 'Sign in to track your class costs' : 'Start tracking what your skips really cost'}
              </p>
            </div>

            {/* Toggle tabs with animated slider */}
            <div className="relative flex bg-gray-100 rounded-xl p-1 mb-6">
              {/* Animated background slider */}
              <motion.div
                className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm"
                initial={false}
                animate={{
                  left: isLogin ? '4px' : '50%',
                  width: 'calc(50% - 4px)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
                className={`relative z-10 flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
                className={`relative z-10 flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  !isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Success message */}
            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* First Name - only for signup */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="What should we call you?"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="you@uwaterloo.ca"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <AnimatePresence>
                    {isLogin && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        type="button" 
                        className="text-sm text-cyan-600 hover:text-cyan-700"
                      >
                        Forgot password?
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password - only for signup */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading 
                  ? (isLogin ? 'Signing in...' : 'Creating account...') 
                  : (isLogin ? 'Sign in' : 'Create account')
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 rounded-xl border border-gray-300 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Footer text */}
            <p className="text-center mt-6 text-gray-500 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-cyan-600 hover:text-cyan-700 font-semibold"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
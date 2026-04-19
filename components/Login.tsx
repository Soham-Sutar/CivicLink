import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/apiService';
import { BuildingOfficeIcon } from './icons';
import Spinner from './Spinner';
import { Role } from '../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };
  
  const handleViewChange = (mode: 'login' | 'signup', isAdmin: boolean) => {
    setAuthMode(mode);
    setIsAdminLogin(isAdmin);
    resetFormState();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      if (isAdminLogin && user.role === Role.USER) {
        throw new Error("This account does not have admin privileges.");
      }
      if (!isAdminLogin && user.role !== Role.USER) {
        throw new Error("Admin accounts must use the Admin Login portal.");
      }
      login(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await registerUser(name, email, password);
      login(user); // Auto-login after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <BuildingOfficeIcon className="w-16 h-16 mx-auto text-primary" />
          {isAdminLogin ? (
            <>
              <h2 className="mt-6 text-3xl font-bold text-center text-neutral">Admin Portal</h2>
              <p className="mt-2 text-sm text-center text-gray-600">Sign in with your administrator credentials</p>
            </>
          ) : authMode === 'signup' ? (
            <>
              <h2 className="mt-6 text-3xl font-bold text-center text-neutral">Create an Account</h2>
              <p className="mt-2 text-sm text-center text-gray-600">Join CivicLink to report issues in your community</p>
            </>
          ) : (
            <>
              <h2 className="mt-6 text-3xl font-bold text-center text-neutral">Welcome to CivicLink</h2>
              <p className="mt-2 text-sm text-center text-gray-600">Sign in to your account to continue</p>
            </>
          )}
        </div>

        <form className="space-y-6" onSubmit={authMode === 'signup' && !isAdminLogin ? handleSignUpSubmit : handleLoginSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {authMode === 'signup' && !isAdminLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400">
              {loading ? <Spinner small /> : (authMode === 'signup' && !isAdminLogin ? 'Create Account' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          {isAdminLogin ? (
            <p>Not an admin?{' '}
              <button onClick={() => handleViewChange('login', false)} className="font-medium text-primary hover:text-blue-500">
                Go to Citizen Login
              </button>
            </p>
          ) : authMode === 'signup' ? (
            <p>Already have an account?{' '}
              <button onClick={() => handleViewChange('login', false)} className="font-medium text-primary hover:text-blue-500">
                Sign In
              </button>
            </p>
          ) : (
            <div className="space-y-2">
              <p>Don't have an account?{' '}
                <button onClick={() => handleViewChange('signup', false)} className="font-medium text-primary hover:text-blue-500">
                  Sign Up
                </button>
              </p>
              <p>Are you an administrator?{' '}
                <button onClick={() => handleViewChange('login', true)} className="font-medium text-primary hover:text-blue-500">
                  Admin Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

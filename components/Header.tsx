import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BuildingOfficeIcon, UserCircleIcon } from './icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-neutral">CivicLink</span>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-6 w-6 text-gray-500" />
                <span className="font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

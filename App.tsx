import React from 'react';
import { useAuth } from './context/AuthContext';
import { Role } from './types';
import Header from './components/Header';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import DeptAdminDashboard from './components/DeptAdminDashboard';
import MainAdminDashboard from './components/MainAdminDashboard';

const App: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) {
      return <Login />;
    }
    // Always show analytics dashboard for carol@admin.gov
    if (user.email === 'carol@admin.gov') {
      return <MainAdminDashboard />;
    }
    switch (user.role) {
      case Role.USER:
        return <UserDashboard />;
      case Role.DEPT_ADMIN:
        return <DeptAdminDashboard />;
      case Role.MAIN_ADMIN:
        return <MainAdminDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="bg-base-100 min-h-screen font-sans text-neutral">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;
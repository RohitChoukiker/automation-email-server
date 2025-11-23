import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { CategoryFilter } from './CategoryFilter';
import { EmailList } from './EmailList';
import type { EmailCategory } from '../types';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import DashboardHeader from './DashboardHeader';

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory>('ALL');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 transition-colors duration-300">
      {/* Animated Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <DashboardHeader user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Your Inbox</h2>
          <p className="text-gray-600 text-lg">Manage and categorize your incoming emails efficiently.</p>
        </div>

        {/* Category Filter */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </div>

        {/* Email List */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <EmailList category={selectedCategory} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

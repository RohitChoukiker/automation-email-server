import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CategoryFilter } from './components/CategoryFilter';
import { EmailList } from './components/EmailList';
import type { EmailCategory } from './types';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Mail, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

function Dashboard() {
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

      {/* Header with Glassmorphism */}
      <header className="glass-strong sticky top-0 z-50 border-b border-white/20 shadow-xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-slide-up">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-transform duration-200">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EmailFlow
              </h1>
              <p className="text-xs text-gray-600">Smart Inbox Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              {user?.picture && (
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-purple-400/50" />
              )}
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-gray-600 hover:text-purple-600 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={logout} 
              className="p-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-gray-600 hover:text-red-600 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md" 
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Your Inbox
          </h2>
          <p className="text-gray-600 text-lg">Manage and categorize your incoming emails efficiently.</p>
        </div>

        {/* Category Filter */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>
        
        {/* Email List */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <EmailList category={selectedCategory} />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/protected" element={<ProtectedRoute />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

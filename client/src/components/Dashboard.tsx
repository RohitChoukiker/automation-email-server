import React, { useState } from 'react';

import { CategoryFilter } from './CategoryFilter';
import { EmailList } from './EmailList';
import type { EmailCategory } from '../types';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import DashboardHeader from './DashboardHeader';

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<EmailCategory>('ALL');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#E9F5FF] text-slate-900 transition-colors duration-300">
      {/* Soft background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-24 h-80 w-80 rounded-full bg-[#E8FFC6] opacity-70 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-[#D0F1FF] opacity-70 blur-3xl" />
      </div>

      <DashboardHeader
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div
          className="mb-8 animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Your Inbox
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Manage and categorize your incoming emails efficiently with
            Inboxonic’s intelligent automation.
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6 lg:p-7">
          {/* Category Filter */}
          <div
            className="mb-5 border-b border-slate-100 pb-4 animate-slide-up"
            style={{ animationDelay: '0.25s' }}
          >
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Email List */}
          <div
            className="animate-slide-up"
            style={{ animationDelay: '0.35s' }}
          >
            <EmailList category={selectedCategory} />
          </div>
        </div>

        {/* Small hint / footer text */}
        <div className="mt-4 text-xs text-slate-500">
          Inboxonic reads and labels your emails using secure OAuth scopes – you
          stay in full control of your Gmail account.
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

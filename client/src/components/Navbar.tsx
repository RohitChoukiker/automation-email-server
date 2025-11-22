import React from 'react';
import { Mail, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onLoginClick: () => void;
  onGetStartedClick: () => void;
  scrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoginClick,
  onGetStartedClick,
  scrollToSection,
}) => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-sky-400 shadow-lg shadow-blue-500/40">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              EmailFlow
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
              AI Inbox OS
            </span>
          </div>
        </div>

        {/* Center links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <button
            onClick={() => scrollToSection('features')}
            className="relative inline-flex items-center gap-1.5 transition hover:text-gray-900"
          >
            <span>Product</span>
            <span className="h-1 w-1 rounded-full bg-gray-400" />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="transition hover:text-gray-900"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="transition hover:text-gray-900"
          >
            FAQ
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Login button */}
          {!isAuthenticated && (
            <button
              onClick={onLoginClick}
              className="hidden items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:flex"
            >
              <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </span>
              Login
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={onGetStartedClick}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-400 hover:to-sky-300"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get started'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

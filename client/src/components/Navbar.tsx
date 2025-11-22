import React from "react";
import { Mail, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeContext";

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
 

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/elogo.png" alt="Inboxonic Logo" className="h-10 w-10" />
     
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              Inboxonic{" "}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
              AI Inbox OS
            </span>
          </div>
        </div>

      

        {/* Right actions */}
        <div className="flex items-center gap-3">
         

          {/* Login button */}
          {!isAuthenticated && (
            <button
              onClick={onLoginClick}
              className="hidden items-center rounded-full border border-gray-200 px-6 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:flex"
            >
            
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

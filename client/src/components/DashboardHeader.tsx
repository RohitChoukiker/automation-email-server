import React from 'react';
import { LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

type Props = {
  user?: User | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
};

export const DashboardHeader: React.FC<Props> = ({ user, theme, onToggleTheme, onLogout }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const navigate = useNavigate();
  const profileRef = React.useRef<HTMLDivElement | null>(null);
  const mobileAvatarRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // Close profile popover on outside click or Escape
  React.useEffect(() => {
    if (!showProfile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowProfile(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedOutsideProfile = profileRef.current && !profileRef.current.contains(target);
      const clickedMobileAvatar = mobileAvatarRef.current && mobileAvatarRef.current.contains(target);
      if (clickedOutsideProfile && !clickedMobileAvatar) {
        setShowProfile(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [showProfile]);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    // navigate to landing page and include hash for section if provided
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-lime-100 bg-[#E8FFC6]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('/')}
            aria-label="Go to home"
            className="flex items-center gap-2 text-left"
          >
            <img src="/elogo.png" alt="Inboxonic Logo" className="h-10 w-12" />
            <span className="text-lg font-semibold tracking-tight">Inboxonic</span>
          </button>
        </div>

        

        {/* Right side: profile + controls + mobile menu */}
        <div className="flex items-center gap-4">
          {/* Mobile trigger: show user avatar on mobile, fallback to hamburger */}
          <button
            type="button"
            ref={mobileAvatarRef}
            onClick={() => {
              if (user?.picture) {
                setShowProfile((s) => !s);
                setMobileOpen(false);
              } else {
                setMobileOpen((s) => !s);
              }
            }}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center rounded-md p-1 text-slate-800 hover:bg-slate-100 sm:hidden"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name ?? 'User'}
                className="h-9 w-9 rounded-full ring-2 ring-purple-400/50 object-cover"
              />
            ) : (
              mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />
            )}
          </button>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile((s) => !s)}
              className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm"
            >
              {user?.picture && (
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-purple-400/50 object-cover" />
              )}
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </button>

            <div
              className={`fixed left-4 right-4 top-12 z-50 rounded-lg border border-slate-200 bg-white shadow-lg sm:absolute sm:right-0 sm:mt-2 sm:w-56 transform transition-all duration-200 ease-out ${
                showProfile ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'
              }`}
              aria-hidden={!showProfile}
            >
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="mt-1 text-xs text-slate-600">{user?.email}</p>
              </div>
              <div className="border-t border-slate-100 px-3 py-2">
                <button
                  onClick={() => { setShowProfile(false); onLogout(); }}
                  className="w-full text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>


         
        </div>

       
      </div>
    </header>
  );
};

export default DashboardHeader;

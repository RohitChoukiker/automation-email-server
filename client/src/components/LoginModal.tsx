import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { BACKEND_BASE_URL } from '../api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Handle animation on mount/unmount
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible 
          ? 'bg-slate-900/40 backdrop-blur-sm' 
          : 'bg-slate-900/0 backdrop-blur-none'
      }`}
    >
      {/* Card */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md rounded-3xl border border-lime-100 bg-[#FFFDF5] px-7 py-8 shadow-2xl shadow-slate-900/20 transition-all duration-300 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon + heading */}
        <div className="mb-6 flex flex-col items-center text-center">
           <img src="/elogo.png" alt="Inboxonic Logo" className="h-16 w-16" />

          <h2 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="max-w-xs text-sm text-slate-600">
            Plug into your intelligent inbox in just one click with Google.
          </p>
        </div>

        {/* Google button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              // Redirect to backend OAuth endpoint
              window.location.href = `${BACKEND_BASE_URL}/api/auth/google`;
            }}
            className="flex items-center gap-3 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Fine print */}
        <div className="mt-6 rounded-2xl bg-[#EAF6FF] px-4 py-3 text-center text-[11px] leading-relaxed text-slate-600">
          We never store your Google password and only use OAuth to access your
          inbox. By continuing, you agree to our{' '}
          <button
            onClick={() => {
              onClose();
              window.location.href = '/terms';
            }}
            className="font-medium text-slate-900 underline hover:text-slate-700"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            onClick={() => {
              onClose();
              window.location.href = '/privacy';
            }}
            className="font-medium text-slate-900 underline hover:text-slate-700"
          >
            Privacy Policy
          </button>
          .
        </div>
      </div>
    </div>
  );
};

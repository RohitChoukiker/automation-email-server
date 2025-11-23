import React from 'react';
import { X, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-lime-100 bg-[#FFFDF5] px-7 py-8 shadow-2xl shadow-slate-900/20">
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
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              login(credentialResponse);
              onClose();
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="outline"
            shape="pill"
            size="large"
            text="continue_with"
            width="280"
          />
        </div>

        {/* Fine print */}
        <div className="mt-6 rounded-2xl bg-[#EAF6FF] px-4 py-3 text-center text-[11px] leading-relaxed text-slate-600">
          We never store your Google password and only use OAuth to access your
          inbox. By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

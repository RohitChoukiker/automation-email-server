import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="mx-auto max-w-lg rounded-2xl bg-white/90 p-10 text-center shadow-lg">
        <h1 className="text-6xl font-bold text-purple-600">404</h1>
        <p className="mt-4 text-lg text-slate-700">Sorry, we couldn't find that page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-lime-100 shadow-sm hover:bg-slate-800"
          >
            Go to Home
          </button>

          {isAuthenticated && (
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-full border border-slate-900/10 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Open Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;

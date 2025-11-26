import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        // Decode user data
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // Store token
        localStorage.setItem('token', token);
        
        // Login user
        loginWithUser(userData);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to process auth callback:', error);
        navigate('/?error=auth_failed');
      }
    } else {
      navigate('/?error=missing_params');
    }
  }, [searchParams, loginWithUser, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#EAF6FF] via-[#F4F7FF] to-white">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Completing sign in...
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Please wait while we redirect you to your dashboard.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
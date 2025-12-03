// src/components/EmailDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchEmailById } from '../api';

export const EmailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('No email id');
        const data = await fetchEmailById(id);
        if (!mounted) return;
        setEmail(data);
      } catch (err) {
        console.error('Failed to load email:', err);
        if (mounted) setError('Email not found or failed to load.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {error || !email ? (
        <div className="text-red-600 font-medium">{error || 'Email not found.'}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {email.subject}
          </h1>

          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <div>
              <div>
                From: <span className="font-medium">{email.from || email.sender}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Category: {email.intent || email.category || 'UNKNOWN'}
              </div>
            </div>
            <span className="text-xs text-gray-400">{email.createdAt || email.date}</span>
          </div>

          <hr className="my-4" />

          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {email.summary || email.body || email.content}
          </p>
        </div>
      )}
    </div>
  );
};

// src/components/EmailDetail.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SAMPLE_EMAILS } from '../data/sampleEmails';

export const EmailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const email = SAMPLE_EMAILS.find((e) => e.id === id);

  if (!email) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <p className="text-red-600 font-medium">Email not found.</p>
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

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {email.subject}
        </h1>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <div>
            <div>
              From: <span className="font-medium">{email.sender}</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Category: {email.category}
            </div>
          </div>
          <span className="text-xs text-gray-400">{email.date}</span>
        </div>

        <hr className="my-4" />

        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {email.content}
        </p>
      </div>
    </div>
  );
};

// src/components/EmailCard.tsx
import React from 'react';
import type { Email } from '../types';

interface EmailCardProps {
  email: Email;
  onClick: () => void;
  showCategory?: boolean;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  onClick,
  showCategory = false,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col gap-1"
    >
      <div className="flex justify-between items-center gap-3">
        <div className="font-semibold text-gray-900 truncate">
          {email.subject}
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {email.date}
        </span>
      </div>

      <div className="text-sm text-gray-600 truncate">
        From: <span className="font-medium">{email.sender}</span>
      </div>

      {showCategory && (
        <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
          {email.category}
        </span>
      )}

      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {email.content}
      </p>
    </button>
  );
};

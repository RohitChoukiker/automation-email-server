// src/components/EmailCard.tsx
import React from 'react';
import type { Email } from '../types';

interface EmailCardProps {
  email: Email;
  onClick: () => void;
  onMouseEnter?: () => void;
  showCategory?: boolean;
  isActive?: boolean;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  onClick,
  onMouseEnter,
  showCategory = false,
  isActive = false,
}) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`w-full text-left rounded-xl border p-4 transition-all flex flex-col gap-1
        ${
          isActive
            ? 'bg-blue-50 border-blue-300 shadow-sm'
            : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md'
        }`}
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

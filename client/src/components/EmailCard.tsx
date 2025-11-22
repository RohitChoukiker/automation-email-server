import React from 'react';
import type { Email } from '../types';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface EmailCardProps {
  email: Email;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const categoryConfig = {
    URGENT: { 
      bg: 'bg-gradient-to-r from-red-500 to-pink-600', 
      text: 'text-white',
      glow: 'shadow-red-500/30'
    },
    MEETING: { 
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-600', 
      text: 'text-white',
      glow: 'shadow-purple-500/30'
    },
    ORDER: { 
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600', 
      text: 'text-white',
      glow: 'shadow-green-500/30'
    },
    PAYMENT: { 
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600', 
      text: 'text-white',
      glow: 'shadow-yellow-500/30'
    },
    AI_ANSWER: { 
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-600', 
      text: 'text-white',
      glow: 'shadow-blue-500/30'
    },
    OTHER: { 
      bg: 'bg-gradient-to-r from-gray-500 to-slate-600', 
      text: 'text-white',
      glow: 'shadow-gray-500/30'
    },
    ALL: { 
      bg: 'bg-gradient-to-r from-gray-500 to-slate-600', 
      text: 'text-white',
      glow: 'shadow-gray-500/30'
    },
  };

  const config = categoryConfig[email.category] || categoryConfig.OTHER;

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Gradient Border Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className={clsx('px-3 py-1.5 rounded-full text-xs font-bold shadow-lg', config.bg, config.text, config.glow)}>
            {email.category.replace('_', ' ')}
          </span>
          {email.isRead && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              Read
            </span>
          )}
        </div>
        <div className="flex items-center text-gray-500 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {new Date(email.date).toLocaleDateString()}
        </div>
      </div>

      {/* Subject */}
      <h3 className="text-xl font-display font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-purple-600 transition-colors duration-200">
        {email.subject}
      </h3>
      
      {/* From */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <User className="w-4 h-4 mr-2 text-purple-500" />
        <span className="truncate font-medium">{email.from}</span>
      </div>

      {/* Snippet */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-5 leading-relaxed">
        {email.snippet}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-400 font-mono">
          <Tag className="w-3 h-3 mr-1.5" />
          {email.id.slice(0, 8)}...
        </div>
        <button className="group/btn flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200">
          View Details
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

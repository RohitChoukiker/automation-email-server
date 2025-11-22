import React from 'react';
import type { EmailCategory } from '../types';
import { clsx } from 'clsx';
import { Inbox, AlertCircle, Calendar, ShoppingBag, CreditCard, Sparkles, Folder } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: EmailCategory;
  onSelectCategory: (category: EmailCategory) => void;
}

const CATEGORIES: { value: EmailCategory; label: string; icon: React.ReactNode; gradient: string }[] = [
  { value: 'ALL', label: 'All', icon: <Inbox className="w-4 h-4" />, gradient: 'from-gray-600 to-gray-800' },
  { value: 'URGENT', label: 'Urgent', icon: <AlertCircle className="w-4 h-4" />, gradient: 'from-red-500 to-pink-600' },
  { value: 'MEETING', label: 'Meeting', icon: <Calendar className="w-4 h-4" />, gradient: 'from-purple-500 to-indigo-600' },
  { value: 'ORDER', label: 'Order', icon: <ShoppingBag className="w-4 h-4" />, gradient: 'from-green-500 to-emerald-600' },
  { value: 'PAYMENT', label: 'Payment', icon: <CreditCard className="w-4 h-4" />, gradient: 'from-yellow-500 to-orange-600' },
  { value: 'AI_ANSWER', label: 'AI Answer', icon: <Sparkles className="w-4 h-4" />, gradient: 'from-blue-500 to-cyan-600' },
  { value: 'OTHER', label: 'Other', icon: <Folder className="w-4 h-4" />, gradient: 'from-slate-500 to-slate-700' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelectCategory(category.value)}
          className={clsx(
            'group relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105',
            selectedCategory === category.value
              ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg shadow-${category.value === 'URGENT' ? 'red' : category.value === 'MEETING' ? 'purple' : category.value === 'ORDER' ? 'green' : category.value === 'PAYMENT' ? 'yellow' : category.value === 'AI_ANSWER' ? 'blue' : 'gray'}-500/50 animate-glow`
              : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200/50 shadow-sm hover:shadow-md'
          )}
        >
          <span className="flex items-center gap-2">
            {category.icon}
            {category.label}
          </span>
          {selectedCategory === category.value && (
            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></span>
          )}
        </button>
      ))}
    </div>
  );
};

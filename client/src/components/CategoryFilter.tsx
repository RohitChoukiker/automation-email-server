import React from "react";
import type { EmailCategory } from "../types";
import clsx from "clsx";
import {
  Users,
  Inbox,
  Handshake,
  DollarSign,
  Bug,
  Sparkles,
  CreditCard,
  Calendar,
  Repeat,
  HelpCircle,
  Briefcase,
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: EmailCategory;
  onSelectCategory: (category: EmailCategory) => void;
}

// 🔥 HIGH PRIORITY + IMPORTANT CATEGORIES (sorted TOP)
const CATEGORIES: { value: EmailCategory; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "All", icon: <Inbox className="w-3.5 h-3.5" /> },
  { value: "MEETING", label: "Meeting", icon: <Calendar className="w-3.5 h-3.5" /> },
  { value: "FOLLOWUP", label: "Follow Up", icon: <Repeat className="w-3.5 h-3.5" /> },
  { value: "URGENT", label: "Urgent", icon: <Bug className="w-3.5 h-3.5" /> }, // icon choice optional
  { value: "INVESTOR", label: "Investor", icon: <DollarSign className="w-3.5 h-3.5" /> },
 
  { value: "LEAD", label: "Lead", icon: <Users className="w-3.5 h-3.5" /> },
  { value: "PARTNERSHIP", label: "Partnership", icon: <Handshake className="w-3.5 h-3.5" /> },
  { value: "HIRING", label: "Hiring", icon: <Briefcase className="w-3.5 h-3.5" /> },
 
  { value: "BILLING", label: "Billing", icon: <CreditCard className="w-3.5 h-3.5" /> },
 
  {value: "OTHER", label: "Other", icon: <Sparkles className="w-3.5 h-3.5" /> },
];


const CATEGORY_STYLES: Record<EmailCategory, string> = {
  ALL: "bg-gray-50 text-gray-700 border-gray-200",
  LEAD: "bg-orange-50 text-orange-700 border-orange-200",
 
  PARTNERSHIP: "bg-indigo-50 text-indigo-700 border-indigo-200",
  INVESTOR: "bg-purple-50 text-purple-700 border-purple-200",
 
  MEETING: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FOLLOWUP: "bg-teal-50 text-teal-700 border-teal-200",

  HIRING: "bg-violet-50 text-violet-700 border-violet-200",
  URGENT: "bg-red-100 text-red-800 border-red-300 font-semibold",
   OTHER: "bg-gray-50 text-gray-700 border-gray-200",
};


export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div>
      {/* Mobile: show a native select */}
      <div className="sm:hidden mb-3">
        <label htmlFor="category-select" className="sr-only">
          Select category
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value as EmailCategory)}
          className="block w-full rounded-md border px-3 py-2 text-sm bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop / tablet: show chips (hidden on small screens) */}
      <div className="hidden sm:flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.value;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onSelectCategory(category.value)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5",
                "text-xs font-medium transition-all duration-150",
                "hover:bg-gray-50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-purple-500",
                isActive
                  ? CATEGORY_STYLES[category.value]
                  : "bg-white text-gray-600 border-gray-200"
              )}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

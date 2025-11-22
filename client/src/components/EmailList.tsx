import React, { useEffect, useState } from 'react';
import type { Email, EmailCategory } from '../types';
import { fetchEmails } from '../api';
import { EmailCard } from './EmailCard';
import { Loader2, Inbox } from 'lucide-react';

interface EmailListProps {
  category: EmailCategory;
}

export const EmailList: React.FC<EmailListProps> = ({ category }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmails(category);
        setEmails(data);
      } catch (err) {
        setError('Failed to load emails. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No emails found in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
};

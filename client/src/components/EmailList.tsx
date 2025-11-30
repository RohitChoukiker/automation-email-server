// src/components/EmailList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Email, EmailCategory } from '../types';
import { EmailCard } from './EmailCard';
import { Loader2, Inbox, ExternalLink } from 'lucide-react';
import { SAMPLE_EMAILS } from '../data/sampleEmails';

interface EmailListProps {
  category: EmailCategory;
}

export const EmailList: React.FC<EmailListProps> = ({ category }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const navigate = useNavigate();

  // Load + filter emails by category
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      let filtered = SAMPLE_EMAILS;
      if (category !== 'ALL') {
        filtered = SAMPLE_EMAILS.filter((email) => email.category === category);
      }
      setEmails(filtered);
    } catch (err) {
      setError('Failed to load emails.');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // LEVEL 3: auto-select first email OR keep previous if still visible
  useEffect(() => {
    if (emails.length === 0) {
      setSelectedEmail(null);
      return;
    }

    setSelectedEmail((prev) => {
      if (prev && emails.some((e) => e.id === prev.id)) {
        return prev; // pehle se selected email list me hai toh wahi rehne do
      }
      return emails[0]; // warna pehla auto select
    });
  }, [emails]);

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
        <p className="text-gray-500 font-medium">
          No emails found in this category
        </p>
      </div>
    );
  }

  // LEVEL 2 + SPLIT VIEW
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT: Email list */}
      <div className="md:w-1/2 lg:w-2/5">
        <div className="overflow-auto max-h-[70vh] space-y-3 pr-1">
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onClick={() => setSelectedEmail(email)}           // click → select
              onMouseEnter={() => setSelectedEmail(email)}      // hover → select
              showCategory={category === 'ALL'}
              isActive={selectedEmail?.id === email.id}         // highlight active
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Preview panel */}
      <div className="md:w-1/2 lg:w-3/5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-[70vh] flex flex-col">
          {selectedEmail ? (
            <>
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedEmail.subject}
                </h2>
                <div className="mt-1 text-sm text-gray-600">
                  From:{' '}
                  <span className="font-medium">{selectedEmail.sender}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400 flex items-center gap-2">
                  <span>{selectedEmail.date}</span>
                  <span>•</span>
                  <span>{selectedEmail.category}</span>
                </div>
              </div>

              <hr className="my-3" />

              <div className="flex-1 overflow-auto">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.content}
                </p>
              </div>

              {/* optional: open full page (same /email/:id route) */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                
                </span>
                <button
                  onClick={() => navigate(`/email/${selectedEmail.id}`)}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open full view
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            </div>
          )}
        </div>
        
      </div>

      
    </div>
    
  );
};

// src/components/EmailList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Email, EmailCategory } from '../types';
import { fetchEmails, sendEmail } from '../api';
import { EmailCard } from './EmailCard';
import { Loader2, Inbox, ExternalLink } from 'lucide-react';

interface EmailListProps {
  category: EmailCategory;
}

export const EmailList: React.FC<EmailListProps> = ({ category }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load + filter emails by category (from backend)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // `category` can be 'ALL' or specific like 'URGENT'
        const backendEmails = await fetchEmails(category as any);

        if (!mounted) return;

        // Map backend email shape to frontend `Email` type
        const mapped: Email[] = backendEmails.map((e: any) => ({
          id: e._id || e.id || String(Math.random()),
          subject: e.subject || '(no subject)',
          sender: e.from || e.sender || 'Unknown',
          // prefer raw body/snippet for the main content; keep AI summary separate
          content: e.body || e.snippet || e.summary || '',
          // map any AI-generated summary fields into `aiSummary` when present
          aiSummary: e.aiSummary || e.generatedSummary || e.summary || e.summaryText || undefined,
          // try to map backend intent/category to our EmailCategory when possible
          category: (e.intent as EmailCategory) || (category as EmailCategory) || 'ALL',
          date: e.createdAt ? new Date(e.createdAt).toLocaleString() : (e.date || ''),
          isRead: e.isRead || false,
          snippet: e.snippet || undefined,
        }));

        setEmails(mapped);
      } catch (err) {
        console.error('EmailList fetch error:', err);
        setError('Failed to load emails from server.');
        setEmails([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [category]);

  const handleSend = async () => {
    if (!selectedEmail) return;
    setSending(true);
    setSendStatus(null);

    try {
      // prefer AI summary as the reply text if available
      const text = selectedEmail.aiSummary || selectedEmail.content || '';
      await sendEmail(selectedEmail.id, text);
      setSendStatus('Sent');
    } catch (err) {
      console.error('Send error:', err);
      setSendStatus('Failed to send');
    } finally {
      setSending(false);
      // clear status after a short delay
      setTimeout(() => setSendStatus(null), 3000);
    }
  };

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

  // Show a full-page loader only when we have no emails yet.
  if (loading && emails.length === 0) {
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
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : selectedEmail ? (
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
                {/* AI summary (if available) */}
                {selectedEmail.aiSummary && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded">
                    <h3 className="text-sm font-medium text-gray-700">AI Summary</h3>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedEmail.aiSummary}
                    </p>
                  </div>
                )}
              </div>

              <hr className="my-3" />

              <div className="flex-1 overflow-auto">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.content}
                </p>
              </div>

              {/* optional: open full page (same /email/:id route) */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded ${sending ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Send'
                    )}
                  </button>

                  {sendStatus && (
                    <span className={`text-sm ${sendStatus === 'Sent' ? 'text-green-600' : 'text-red-600'}`}>
                      {sendStatus}
                    </span>
                  )}
                </div>

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

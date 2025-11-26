import React from 'react';
import { X } from 'lucide-react';
import { fetchEmailById } from '../api';
import type { Email } from '../types';

interface EmailModalProps {
  id: string | null;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ id, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<Partial<Email & any> | null>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (id) {
      // show a sample email immediately while we fetch the real data
      setError(null);
      setEmail({
        id,
        subject: 'Sample: Welcome to Automation',
        from: 'no-reply@example.com',
        date: new Date().toISOString(),
        snippet: 'This is a sample email snippet. Click to see more details.',
        body: 'Hello User,\n\nThis is a sample email body added for demonstration purposes. Replace this with real email content when the backend is available.\n\nRegards,\nAutomation Team',
        summary: 'Sample summary: This email demonstrates how the email details view looks when an item is clicked.'
      } as Partial<Email>);

      setLoading(true);
      fetchEmailById(id)
        .then((data) => {
          if (data) setEmail(data);
        })
        .catch(() => {
          // keep sample email, but surface a non-blocking error message
          setError('Failed to load full email; showing sample.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  React.useEffect(() => {
    if (id) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [id]);

  // click outside to close
  React.useEffect(() => {
    if (!id) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timeout = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 100);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [id, onClose]);

  React.useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [id, onClose]);

  if (!id) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 transition-all duration-300 ${isVisible ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-slate-900/0 backdrop-blur-none'}`}>
      <div ref={modalRef} className={`relative w-full max-w-3xl rounded-2xl border bg-white px-6 py-5 shadow-2xl transition-all duration-300 ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-6'}`}>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-40">Loading...</div>
        ) : error ? (
          <div className="text-red-600 py-8 text-center">{error}</div>
        ) : email ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{email.subject || '(No subject)'}</h3>
                <div className="mt-1 text-sm text-gray-600">
                  <div><strong>From:</strong> {email.from || 'Unknown'}</div>
                  {email.date && <div className="text-xs text-gray-400">{new Date(email.date).toLocaleString()}</div>}
                </div>
              </div>
            </div>

            <div className="prose max-w-none text-sm text-gray-800">
              {email.body ? (
                <div>{email.body}</div>
              ) : (
                <div>{email.snippet}</div>
              )}
            </div>

            {email.summary && (
              <div className="rounded-lg border bg-[#FBFBFB] p-4 text-sm">
                <strong className="block mb-1">AI Summary</strong>
                <div className="text-gray-700">{email.summary}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">No email data</div>
        )}
      </div>
    </div>
  );
};

export default EmailModal;

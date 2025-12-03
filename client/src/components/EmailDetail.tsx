// src/components/EmailDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchEmailById, sendEmail } from '../api';

export const EmailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('No email id');
        const data = await fetchEmailById(id);
        if (!mounted) return;
        setEmail(data);
      } catch (err) {
        console.error('Failed to load email:', err);
        if (mounted) setError('Email not found or failed to load.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Prefill reply draft when email loads
  useEffect(() => {
    if (!email) {
      setReplyText('');
      return;
    }
    // Prefer backend-provided replyDraft, then AI summary, then summary/body
    setReplyText(email.replyDraft ?? email.aiSummary ?? email.summary ?? email.body ?? '');
  }, [email]);

  const handleSend = async () => {
    if (!email) return;
    setSending(true);
    setSendStatus(null);

    try {
      const text = replyText || email.aiSummary || email.summary || email.body || '';
      const idToSend = email._id || email.id || email.emailId || '';
      if (!idToSend) throw new Error('No email id to send to');
      await sendEmail(idToSend, text);
      setSendStatus('Sent');
      setReplyText('');
    } catch (err) {
      console.error('Send error:', err);
      setSendStatus('Failed to send');
    } finally {
      setSending(false);
      setTimeout(() => setSendStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {error || !email ? (
        <div className="text-red-600 font-medium">{error || 'Email not found.'}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            {email.subject}
          </h1>

          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <div>
              <div>
                From: <span className="font-medium">{email.from || email.sender}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Category: {email.intent || email.category || 'UNKNOWN'}
              </div>
            </div>
            <span className="text-xs text-gray-400">{email.createdAt || email.date}</span>
          </div>

          <hr className="my-4" />

          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
            {email.summary || email.body || email.content}
          </p>
          {/* Reply draft + controls */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <label className="text-xs text-gray-500 mb-2 block">Draft reply</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={8}
              placeholder="Edit AI suggestion or compose your reply..."
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSend}
                  disabled={sending || !replyText.trim()}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded ${sending ? 'bg-green-300 text-white cursor-not-allowed' : !replyText.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                </button>

                {sendStatus && (
                  <span className={`text-sm ${sendStatus === 'Sent' ? 'text-green-600' : 'text-red-600'}`}>
                    {sendStatus}
                  </span>
                )}

                <button
                  onClick={() => setReplyText(email ? (email.aiSummary ?? email.summary ?? email.body ?? '') : '')}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="text-xs text-gray-500">{replyText.length} chars</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

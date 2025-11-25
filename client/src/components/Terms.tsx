import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF6FF] via-[#F4F7FF] to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <img src="/elogo.png" alt="Inboxonic Logo" className="h-16 w-16" />
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Terms of Service
          </h1>

          {/* Coming Soon Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#E8FFC6] px-6 py-2 text-sm font-semibold text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Coming Soon
          </div>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            We're currently drafting our comprehensive terms of service. This
            document will outline the rules and guidelines for using Inboxonic.
            Check back soon!
          </p>

          {/* Info Box */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white/90 p-8 text-left shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              What to expect:
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
                <span>
                  Clear guidelines on how to use Inboxonic services responsibly.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
                <span>
                  Information about your rights and our obligations as a service
                  provider.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
                <span>
                  Transparent policies on account management, billing, and
                  cancellation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
                <span>
                  Details about acceptable use and prohibited activities.
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-lime-100 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Brain,
  Inbox,
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthProvider';
import { LoginModal } from './LoginModal';
import { Navbar } from './Navbar';

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: 'Instant Categorization',
    desc: 'AI instantly tags incoming emails as Urgent, Meeting, Order, Payment or AI Answer so you never miss what matters.',
    bg: 'bg-amber-50',
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    title: 'Smart Filtering',
    desc: 'Noise is automatically filtered out while high-priority threads are surfaced to the top of your inbox.',
    bg: 'bg-emerald-50',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
    title: 'Analytics Dashboard',
    desc: 'Understand your email volume, response times and category breakdown with a single glance.',
    bg: 'bg-indigo-50',
  },
];

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewDemo = () => scrollToSection('demo');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Soft gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-[-220px] mx-auto h-[260px] max-w-4xl rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 opacity-50 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-80px] h-[220px] w-[320px] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-60px] h-[240px] w-[320px] rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onGetStartedClick={handleGetStarted}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 lg:pt-20">
        <div className="mx-auto flex max-w-6xl  gap-12 px-4 sm:px-6  lg:items-center lg:gap-16 lg:px-8">
        
          <div>
           
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3rem]">
              Tame your inbox with{' '}
              <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                intelligent automation
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Inboxonic sits on top of Gmail, automatically categorizing and
              prioritizing every incoming email so you can focus on work that
              actually moves the needle.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleGetStarted}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/40 sm:w-auto"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="w-full sm:w-auto">
                  <GoogleLogin
                    onSuccess={login}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                    theme="filled_blue"
                    shape="pill"
                    size="large"
                    text="continue_with"
                  />
                </div>
              )}

              <button
                onClick={handleViewDemo}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <PlayCircle className="h-3.5 w-3.5 transition-transform group-hover:scale-105" />
                </div>
                View live demo
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>2-day full-feature trial</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Works with your existing Gmail</span>
              </div>
            </div>
          </div>

      
        </div>
      </section>

      {/* Features Section */}
      <section
        className="border-t border-slate-200 bg-white/80 py-16 backdrop-blur"
        id="features"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Features
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Everything you need to master your inbox
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Powerful features designed to help you process emails faster and more
              intelligently — without changing your existing tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-50 blur-2xl" />
                <div
                  className={`${feature.bg} flex h-11 w-11 items-center justify-center rounded-xl bg-opacity-90 shadow-sm`}
                >
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section
        className="border-t border-slate-200 bg-slate-50/80 py-16"
        id="demo"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Live preview
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              See exactly how Inboxonic organizes your day
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Incoming emails are automatically categorized into Urgent, Meeting,
              Order, Payment and AI Answer. You get a clean, prioritized inbox
              without changing the way you work.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                   Urgent threads are highlighted at the top so you never miss
                  critical messages.
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                   Meeting invites and reminders are grouped and ready to sync
                  with your calendar.
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                   AI Answer category catches questions that your AI assistant can
                  respond to instantly.
                </span>
              </li>
            </ul>
          </div>

          {/* Fake inbox preview card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600">
                  <Inbox className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Smart Inbox View
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Today · 12 new</span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700 ring-1 ring-sky-200">
                 Urgent
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
                 Meeting
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 ring-1 ring-amber-200">
                 Payment
              </span>
              <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-fuchsia-700 ring-1 ring-fuchsia-200">
                 AI Answer
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2 rounded-lg bg-slate-50/90 p-2.5 ring-1 ring-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">
                    Payment overdue for Invoice #1042
                  </p>
                  <p className="line-clamp-1 text-slate-500">
                    Finance · Your payment for October is pending. Please complete
                    within 24 hours...
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700 ring-1 ring-amber-200">
                  💵 Payment
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 rounded-lg bg-slate-50/90 p-2.5 ring-1 ring-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">
                    Can you help me understand this report?
                  </p>
                  <p className="line-clamp-1 text-slate-500">
                    Client · I&apos;m a bit confused about the last section in the
                    metrics dashboard...
                  </p>
                </div>
                <span className="rounded-full bg-fuchsia-50 px-2 py-1 text-fuchsia-700 ring-1 ring-fuchsia-200">
                   AI Answer
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 rounded-lg bg-slate-50/90 p-2.5 ring-1 ring-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">
                    Project sync tomorrow at 4:30 PM
                  </p>
                  <p className="line-clamp-1 text-slate-500">
                    Calendar · You&apos;re invited to &quot;Q4 Planning Sync&quot;
                    with the product team...
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-200">
                  Meeting
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-t border-slate-200 bg-white py-16"
        id="how-it-works"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-slate-900">
              How Inboxonic works
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Plug in your Gmail once. From that moment, every incoming email gets
              processed by our AI pipeline – within milliseconds.
            </p>
          </div>

          <div className="grid gap-6 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Step 1
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Connect your Gmail
              </h3>
              <p className="text-slate-600">
                Securely authenticate with Google OAuth. We only request the scopes
                required to read and label your emails.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Step 2
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                AI categorizes in real time
              </h3>
              <p className="text-slate-600">
                Our models scan subject, content and metadata to assign the best
                category and priority score to every message.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Step 3
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                You work from a clean inbox
              </h3>
              <p className="text-slate-600">
                View everything inside your EmailFlow dashboard or keep using
                Gmail — your labels and filters stay perfectly in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Security */}
      <section
        className="border-t border-slate-200 bg-slate-50/80 py-16"
        id="faq"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Built with security in mind
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              We never store your Google password and only use OAuth to access your
              inbox. Data is transmitted over HTTPS and stored using
              industry-standard encryption.
            </p>
            <div className="mt-5 flex items-start gap-3 text-sm text-slate-700">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span>
                AI runs on your configured provider — you stay in control of your
                prompts, data, and costs.
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-900">
                Do I have to change my email client?
              </p>
              <p>
                No. EmailFlow works on top of Gmail. You can keep using your
                existing apps while we handle categorization and automation in the
                background.
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-900">
                Can I turn off automation at any time?
              </p>
              <p>
                Yes. You can pause EmailFlow or disconnect your account in a single
                click from the dashboard.
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-900">
                Is there a free plan?
              </p>
              <p>
                We offer a 2-day free trial with all features unlocked so you can
                see the value before upgrading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-xs text-slate-500 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
             <img src="/elogo.png" alt="Inboxonic Logo" className="h-10 w-10" />
            <span className="text-sm font-semibold text-slate-900">
              Inboxonic
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
              <span>© {new Date().getFullYear()} Inboxonic Inc. All rights reserved.</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-400 md:inline-block" />
            <button className="hover:text-slate-900">Privacy</button>
            <span className="hidden h-1 w-1 rounded-full bg-slate-400 md:inline-block" />
            <button className="hover:text-slate-900">Terms</button>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

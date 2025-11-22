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
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: 'Instant Categorization',
    desc: 'AI instantly tags incoming emails as Urgent, Meeting, Order, Payment or AI Answer so you never miss what matters.',
    bg: 'bg-yellow-100',
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    title: 'Smart Filtering',
    desc: 'Noise is automatically filtered out while high-priority threads are surfaced to the top of your inbox.',
    bg: 'bg-emerald-100',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    title: 'Analytics Dashboard',
    desc: 'Understand your email volume, response times and category breakdown with a single glance.',
    bg: 'bg-purple-100',
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
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
      {/* Gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-200px] opacity-60 blur-3xl">
          <div className="mx-auto h-[260px] w-[600px] rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-violet-500" />
        </div>
        <div className="absolute bottom-[-200px] left-[-100px] h-[240px] w-[320px] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-80px] h-[260px] w-[340px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onGetStartedClick={handleGetStarted}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 lg:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:px-8">
          {/* Left: Copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-900 shadow shadow-blue-500/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="uppercase tracking-[0.18em]">
                New • AI smart categorization
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.1rem]">
              Tame your inbox with{' '}
              <span className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                intelligent automation
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              EmailFlow sits on top of Gmail, automatically categorizing and
              prioritizing every incoming email so that you can focus on the work
              that actually moves the needle.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:from-blue-400 hover:to-sky-300"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get started free'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleViewDemo}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <PlayCircle className="h-3.5 w-3.5 group-hover:scale-105" />
                </div>
                View live demo
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>14-day full-feature trial</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Works with your existing Gmail</span>
              </div>
            </div>
          </div>

          {/* Right: Hero card */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[32px] bg-gradient-to-tr from-blue-500/20 via-sky-400/15 to-fuchsia-500/15 opacity-60 blur-3xl" />
            <div className="relative rounded-3xl border border-gray-200 bg-white/80 p-4 shadow-2xl shadow-gray-200/70 backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      Smart Inbox
                    </p>
                    <p className="text-[11px] text-gray-500">
                      AI-prioritized threads
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-700">
                  Today · <span className="font-semibold text-gray-900">12</span>{' '}
                  new
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 ring-1 ring-blue-200">
                  🔥 Urgent
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
                  📅 Meeting
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 ring-1 ring-amber-200">
                  💵 Payment
                </span>
                <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-fuchsia-700 ring-1 ring-fuchsia-200">
                  🧠 AI Answer
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { title: 'Payment overdue for Invoice #1042', category: 'Payment', color: 'amber' },
                  { title: 'Can you help me understand this report?', category: 'AI Answer', color: 'fuchsia' },
                  { title: 'Project sync tomorrow at 4:30 PM', category: 'Meeting', color: 'emerald' },
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-start justify-between gap-2 rounded-xl bg-gray-50 p-2.5 transition hover:bg-gray-100 hover:shadow">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="line-clamp-1 text-gray-500">Sample email content...</p>
                    </div>
                    <span className={`rounded-full bg-${item.color}-50 px-2 py-1 text-${item.color}-700 ring-1 ring-${item.color}-200`}>
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="border-t border-gray-200 bg-gray-50 py-16 transition-colors duration-300"
        id="features"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-2 inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Features
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Everything you need to master your inbox
            </h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Powerful features designed to help you process emails faster and more
              intelligently — without changing your existing tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-50 blur-2xl" />
                <div
                  className={`${feature.bg} flex h-11 w-11 items-center justify-center rounded-xl bg-opacity-80 shadow-sm`}
                >
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-xs text-gray-500 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-sky-400">
              <Mail className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              EmailFlow
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>© 2024 EmailFlow Inc. All rights reserved.</span>
            <span className="hidden h-1 w-1 rounded-full bg-gray-400 md:inline-block" />
            <button className="hover:text-gray-900">Privacy</button>
            <span className="hidden h-1 w-1 rounded-full bg-gray-400 md:inline-block" />
            <button className="hover:text-gray-900">Terms</button>
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

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Brain,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthProvider";
import { LoginModal } from "./LoginModal";
import { Navbar } from "./Navbar";

const BULLETS = [
  "Neat and clean inbox – no chaos.",
  "Wide coverage: personal + work Gmail.",
  "Your privacy is always maintained.",
  "Friendly, human-like AI replies.",
  "Super easy setup – under 2 minutes.",
];

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handlePlayDemo = () => scrollToSection("why-us");

  return (
    <div className="min-h-screen bg-[#EAF6FF] text-slate-900 antialiased">
      <Navbar
        isAuthenticated={isAuthenticated}
        onGetStarted={handleGetStarted}
        scrollToSection={scrollToSection}
      />

      {/* Hero section */}
      <section id="hero" className="bg-[#EAF6FF] pb-16 pt-12 sm:pt-16 lg:pt-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          {/* Left column */}
          <div className="max-w-xl">
            <h1 className="mb-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.2rem]">
              Fast and reliable{" "}
              <span className="relative inline-block">
                <span className="relative z-10">smart email</span>
                <span
                  aria-hidden
                  className="absolute inset-x-[-4px] bottom-0 top-1 rounded-md bg-[#E8FFC6]"
                />
              </span>{" "}
              automation
            </h1>

            <p className="mb-7 text-base leading-relaxed text-slate-700 sm:text-lg">
              Inboxonic sits on top of Gmail, instantly sorting, prioritizing,
              and even replying to the emails that matter – so your digital
              workspace always feels as clean as a freshly serviced office.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleGetStarted}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-lime-100 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-slate-900 px-5 py-2 text-xs font-semibold text-lime-100 shadow-sm transition hover:bg-slate-800"
                  >
                    Get Started
                  </button>
                </div>
              )}

              <button
                onClick={handlePlayDemo}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/90 px-7 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-white sm:w-auto"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 text-lime-100">
                  <PlayCircle className="h-4 w-4" />
                </span>
                Play demo
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:inline-block" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>2-day full-feature trial</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:inline-block" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Works with your existing Gmail</span>
              </div>
            </div>
          </div>

          {/* Right column – rounded hero card like Cleansy */}
          <div className="relative flex w-full justify-center lg:justify-end">
            <div className="relative h-[320px] w-[320px] overflow-hidden rounded-[46%] bg-[#FDFDFD] shadow-xl shadow-slate-900/5 sm:h-[360px] sm:w-[360px]">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-3xl bg-[#E8FFC6]" />

              <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8">
                <img
                  src="/elogo.png"
                  alt="Inboxonic Logo"
                  className="h-16 w-16"
                />
                <p className="text-center text-sm font-semibold text-slate-900">
                  “My inbox feels freshly cleaned every morning.”
                </p>
                <p className="text-center text-xs text-slate-500">
                  Inboxonic automatically groups Urgent, Meetings, Orders &amp;
                  Payments so you can breeze through tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-slate-200 bg-white py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Heading + subheading */}
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              How Inboxonic works
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Plug in your Gmail once. From that moment, every incoming email
              gets processed by our AI pipeline – within milliseconds.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-[32px] border border-slate-200 bg-white px-7 py-8 shadow-sm">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Step 1
              </p>
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                Connect your Gmail
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Securely authenticate with Google OAuth. We only request the
                scopes required to read and label your emails.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[32px] border border-slate-200 bg-white px-7 py-8 shadow-sm">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Step 2
              </p>
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                AI categorizes in real time
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Our models scan subject, content and metadata to assign the best
                category and priority score to every message.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[32px] border border-slate-200 bg-white px-7 py-8 shadow-sm">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Step 3
              </p>
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                You work from a clean inbox
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                View everything inside your Inboxonic dashboard or keep using
                Gmail — your labels and filters stay perfectly in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* Features Section */}
      <section
        id="features"
        className="border-t border-slate-200 bg-[#F5FBFF] py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Powerful features for your inbox
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Inboxonic makes email effortless — from smart categorization to AI
              replies. Everything works automatically, on top of your existing
              Gmail.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-50 blur-2xl group-hover:bg-sky-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lime-100">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Smart categorization
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Emails are automatically sorted into Urgent, Meeting, Order,
                Payment and AI Answer — no manual labels ever again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-50 blur-2xl group-hover:bg-emerald-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lime-100">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Priority scoring
              </p>
              <p className="mt-2 text-sm text-slate-600">
                AI detects the importance of every email so that crucial
                messages appear first.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-fuchsia-50 blur-2xl group-hover:bg-fuchsia-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lime-100">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Auto-reply suggestions
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Get AI-generated responses you can send with one click — or
                customize before sending.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-50 blur-2xl group-hover:bg-amber-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lime-100">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Analytics dashboard
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Track email trends, response time and category breakdowns — all
                inside your dashboard.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-50 blur-2xl group-hover:bg-sky-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lime-100">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Works with Gmail
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Keep using Gmail — Inboxonic just adds AI logic on top with
                labels &amp; syncing.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-50 blur-2xl group-hover:bg-emerald-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lime-100">
                <Shield className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                No extra apps needed
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Everything runs in browser. No downloads, no setup headaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us section */}
      <section
        id="why-us"
        className="border-t border-lime-100 bg-[#FFFDF5] py-16"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Text side */}
          <div>
            <div className="mb-4 inline-flex items-center rounded-full bg-[#E8FFC6] px-4 py-1 text-xs font-semibold text-emerald-700">
              Why us?
            </div>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900">
              We come as fast as lightning when a new email arrives.
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:text-base">
              As soon as a message lands in your inbox, Inboxonic&apos;s AI
              engine analyzes content, intent and priority — then neatly places
              it where it belongs. You just open a beautifully organized inbox.
            </p>

            <div className="grid gap-4 text-sm text-slate-800 sm:grid-cols-2">
              {BULLETS.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/90">
                    <CheckCircle className="h-3.5 w-3.5 text-lime-200" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative h-[320px] w-[320px] overflow-hidden rounded-[46%] bg-[#FDFDFD] shadow-xl shadow-slate-900/6 sm:h-[360px] sm:w-[360px]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-3xl bg-[#EAF6FF]" />
              <div className="relative flex h-full flex-col justify-center gap-5 px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/90">
                    <Zap className="h-5 w-5 text-lime-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Instant categorization
                    </p>
                    <p className="text-xs text-slate-600">
                      Every email is tagged as Urgent, Meeting, Order, Payment
                      or AI Answer in seconds.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/90">
                    <Shield className="h-5 w-5 text-lime-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Smart filtering
                    </p>
                    <p className="text-xs text-slate-600">
                      Noise disappears, high-priority threads stay at the top.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/90">
                    <BarChart3 className="h-5 w-5 text-lime-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Analytics at a glance
                    </p>
                    <p className="text-xs text-slate-600">
                      Track volume, response time and more from a clean
                      dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Security / FAQ – reuse but match palette */}
      <section id="faq" className="border-t border-lime-100 bg-[#EAF6FF] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Built with security in mind
            </h2>
            <p className="mt-3 text-sm text-slate-700 sm:text-base">
              We never store your Google password and only use OAuth to access
              your inbox. Data is transmitted over HTTPS and stored using
              industry-standard encryption.
            </p>
            <div className="mt-5 flex items-start gap-3 text-sm text-slate-800">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90">
                <Brain className="h-4 w-4 text-lime-200" />
              </div>
              <span>
                AI runs on your configured provider — you stay in control of
                your prompts, data and costs.
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-800">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-900">
                Do I have to change my email client?
              </p>
              <p>
                No. Inboxonic works on top of Gmail. Keep using your existing
                apps while we handle categorization and automation in the
                background.
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-900">
                Can I turn off automation at any time?
              </p>
              <p>
                Yes. You can pause Inboxonic or disconnect your account in one
                click from the dashboard.
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-900">
                Is there a free plan?
              </p>
              <p>
                We offer a 2-day free trial with all features unlocked so you
                can see the value before upgrading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-lime-100 bg-[#FFFDF5] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-xs text-slate-600 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <img src="/elogo.png" alt="Inboxonic Logo" className="h-9 w-9" />
            <span className="text-sm font-semibold text-slate-900">
              Inboxonic
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>
              © {new Date().getFullYear()} Inboxonic Inc. All rights reserved.
            </span>
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

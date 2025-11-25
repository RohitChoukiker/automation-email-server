import React from "react";
import { Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    // If not on landing page, navigate to it first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on landing page, just scroll
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleGetStarted = () => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById('hero');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <footer className="border-t border-slate-200 bg-[#F9FBFD] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* TOP SECTION */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo & Text */}
          <div className="flex items-center gap-2">
            <img src="/elogo.png" alt="Inboxonic Logo" className="h-10 w-10" />
            <span className="text-lg font-semibold text-slate-900">
              Inboxonic
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <button 
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('hero')}
              className="hover:text-slate-900 transition"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="hover:text-slate-900 transition"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('hero')}
              className="hover:text-slate-900 transition"
            >
              Contact
            </button>
          </div>

          {/* Call-to-action */}
          <button 
            onClick={handleGetStarted}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-medium text-lime-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Mail className="h-4 w-4" />
            Try Inboxonic
          </button>
        </div>

        {/* LINE */}
        <div className="my-8 h-px w-full bg-slate-200" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} Inboxonic Inc. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/privacy')}
              className="hover:text-slate-900 transition"
            >
              Privacy
            </button>
            <button 
              onClick={() => navigate('/terms')}
              className="hover:text-slate-900 transition"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

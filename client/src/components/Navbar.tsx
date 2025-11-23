import React from "react";
import { Mail } from "lucide-react";

type NavbarProps = {
  isAuthenticated: boolean;
  onGetStarted: () => void;
  scrollToSection: (id: string) => void;
};

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onGetStarted,
  scrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-lime-100 bg-[#E8FFC6]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <img src="/elogo.png" alt="Inboxonic Logo" className="h-16 w-16" />

          <span className="text-lg font-semibold tracking-tight">
            Inboxonic
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-800 sm:flex">
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:text-slate-950"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-slate-950"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("why-us")}
            className="hover:text-slate-950"
          >
            Why us
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-slate-950"
          >
            FAQ
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-xs font-medium text-slate-800 sm:block">
            <span className="font-semibold">Quick access:</span> Sign in with
            Google
          </div>
          <button
            onClick={onGetStarted}
            className="rounded-full border border-slate-900/10 bg-slate-900 px-5 py-2 text-xs font-semibold text-lime-100 shadow-sm transition hover:bg-slate-800"
          >
            {isAuthenticated ? "Open Dashboard" : "Get Started"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from "react";
import { Menu, X } from "lucide-react";

type NavbarProps = {
  isAuthenticated: boolean;
  onGetStarted: () => void;
  scrollToSection: (id: string) => void;
  showSections?: boolean;
};

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onGetStarted,
  scrollToSection,
  showSections = true,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape key
  React.useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Close on outside click
  React.useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    // Add a small delay to prevent immediate closing when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  const handleGetStarted = () => {
    onGetStarted();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-lime-100 bg-[#E8FFC6] backdrop-blur-md shadow-sm z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              scrollToSection('hero');
              setMobileOpen(false);
            }}
            aria-label="Go to home"
            className="flex items-center gap-2 text-left"
          >
            <img src="/elogo.png" alt="Inboxonic Logo" className="h-10 w-12" />
            <span className="text-lg font-semibold tracking-tight">
              Inboxonic
            </span>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-800 sm:flex">
          {showSections && (
            <>
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
            </>
          )}
        </nav>

        {/* Right side: CTA + mobile menu button */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((s) => !s)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-800 hover:bg-slate-100 focus:outline-none sm:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop CTA */}
          <div className="hidden sm:flex">
            <button
              onClick={onGetStarted}
              className="rounded-full border border-slate-900/10 bg-slate-900 px-5 py-2 text-xs font-semibold text-lime-100 shadow-sm transition hover:bg-slate-800"
            >
              {isAuthenticated ? "Open Dashboard" : "Get Started"}
            </button>
          </div>
        </div>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile menu panel */}
        <div
          ref={mobileMenuRef}
          className={`sm:hidden fixed left-4 right-4 top-16 z-50 origin-top rounded-lg border border-lime-100 bg-[#E8FFC6] p-4 shadow-lg transition-transform duration-200 ease-out ${
            mobileOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "pointer-events-none opacity-0 -translate-y-2 scale-95"
          }`}
          aria-hidden={!mobileOpen}
        >
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-800">
            {showSections && (
              <>
                <button
                  onClick={() => handleNavClick("hero")}
                  className="text-left hover:text-slate-950"
                >
                  Home
                </button>

                <button
                  onClick={() => handleNavClick("features")}
                  className="text-left hover:text-slate-950"
                >
                  Features
                </button>

                <button
                  onClick={() => handleNavClick("why-us")}
                  className="text-left hover:text-slate-950"
                >
                  Why us
                </button>

                <button
                  onClick={() => handleNavClick("faq")}
                  className="text-left hover:text-slate-950"
                >
                  FAQ
                </button>
              </>
            )}

            <div className="mt-2 border-t border-lime-100 pt-3">
              <button
                onClick={handleGetStarted}
                className="w-full rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-lime-100 shadow-sm"
              >
                {isAuthenticated ? "Open Dashboard" : "Get Started"}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

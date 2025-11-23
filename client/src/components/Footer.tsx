import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-lime-100 bg-[#FFFDF5] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-xs text-slate-600 sm:px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <img src="/elogo.png" alt="Inboxonic Logo" className="h-10 w-10" />
          <span className="text-sm font-semibold text-slate-900">Inboxonic</span>
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
  );
};

export default Footer;

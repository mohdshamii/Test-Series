import React from 'react';
import { Terminal, ShieldCheck, Heart, Keyboard, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-500 text-xs py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Col 1: System info */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-2 font-mono">
              <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>GATE DA Examination Engine</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Specialized technical practice hub for GATE Data Science & Artificial Intelligence (DA). 
              Engineered with client-side state persistence, LaTeX rendering, and official scoring rules.
            </p>
          </div>

          {/* Col 2: Content integrity & ethics */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Content Provenance & Integrity</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Official PYQs cite organizing institutes (IISc / IIT Madras / IIT Roorkee). All overlapping CSE PYQs are mapped with provenance tags. 
              Zero server lock-in; 100% functional offline and on GitHub Pages.
            </p>
          </div>

          {/* Col 3: Keyboard Shortcuts */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <Keyboard className="w-4 h-4 text-sky-600" />
              <span>CBT Exam Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
              <div><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Alt + S</kbd> Save & Next</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Alt + R</kbd> Mark Review</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Alt + P</kbd> Prev Question</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Alt + C</kbd> Calculator</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            © {new Date().getFullYear()} GATE DA Test Series Platform. Static Client Architecture.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for serious GATE DA aspirants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

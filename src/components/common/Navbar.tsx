import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Terminal, 
  Layers, 
  History, 
  FileText, 
  Bookmark, 
  AlertCircle, 
  BarChart3, 
  Sliders, 
  Calculator, 
  Sun, 
  Moon, 
  Menu, 
  X,
  BookOpen,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { getUserProgress, updateUserPreferences } from '../../engine/persistence/attemptStorage';

interface NavbarProps {
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCalculator }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return getUserProgress().preferences.theme;
  });

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(nextTheme);
    updateUserPreferences({ theme: nextTheme });
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Terminal className="w-4 h-4" /> },
    { to: '/mocks', label: 'Full Mocks', icon: <Layers className="w-4 h-4" /> },
    { to: '/pyqs', label: 'PYQ Papers', icon: <FileText className="w-4 h-4" /> },
    { to: '/subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/custom-test', label: 'Custom Test', icon: <PlusCircle className="w-4 h-4" /> },
    { to: '/bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { to: '/incorrect', label: 'Errors', icon: <AlertCircle className="w-4 h-4" /> },
    { to: '/history', label: 'History', icon: <History className="w-4 h-4" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white tracking-tight group">
            <div className="w-8 h-8 rounded-md bg-slate-900 dark:bg-sky-500 text-white flex items-center justify-center font-mono text-sm border border-slate-700 shadow-xs group-hover:bg-sky-600 transition">
              DA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold flex items-center gap-1.5 leading-none">
                GATE <span className="text-sky-600 dark:text-sky-400 font-bold">DA</span> Prep
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">v2026</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal leading-tight hidden sm:block">
                Data Science & Artificial Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 6).map(link => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  active
                    ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {navLinks.slice(6).map(link => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition ${
                  active
                    ? 'text-sky-700 dark:text-sky-300 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={link.label}
              >
                {link.icon}
                <span className="hidden xl:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Virtual Calculator Launcher Button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition"
            title="Open GATE Virtual Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Calculator</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle light/dark theme"
            title="Toggle theme"
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 animate-fade-in shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 py-2">
            {navLinks.map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Client Persistence: Local (No Login Needed)</span>
            <button
              onClick={() => {
                onOpenCalculator();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Launch Calculator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

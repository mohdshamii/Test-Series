import React, { useState } from 'react';
import { 
  Sliders, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Sun, 
  Moon, 
  Monitor,
  ShieldCheck
} from 'lucide-react';
import { 
  getUserProgress, 
  updateUserPreferences, 
  exportProgressAsJson, 
  importProgressFromJson, 
  resetAllData 
} from '../engine/persistence/attemptStorage';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const [progress, setProgress] = useState(() => getUserProgress());
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateUserPreferences({ theme });
    setProgress(getUserProgress());
  };

  const handleExport = () => {
    const jsonStr = exportProgressAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate-da-progress-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importProgressFromJson(content);
      if (res.success) {
        setImportStatus({ success: true, msg: 'Progress successfully restored from backup!' });
        setProgress(getUserProgress());
      } else {
        setImportStatus({ success: false, msg: res.error || 'Failed to import backup file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAllData();
    setProgress(getUserProgress());
    setShowResetConfirm(false);
    alert('All local progress, bookmarks, and attempts have been reset.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-12">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [Config]:</span>
          <Badge variant="primary">Client Settings</Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Preferences & Data Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage visual theme, export/import JSON progress backups, and client-side storage policies.
        </p>
      </div>

      {/* Theme Setting */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Interface Theme
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your preferred visual appearance.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-sky-400" /> },
            { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4 text-slate-400" /> }
          ].map(opt => {
            const isSelected = progress.preferences.theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleThemeChange(opt.id as any)}
                className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Backup & Restore Progress */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Progress Backup & Restore
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Since no account or login is required, your data lives securely in your local browser. Export a JSON backup to transfer to another device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            onClick={handleExport}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Progress JSON
          </Button>

          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">
              <Upload className="w-3.5 h-3.5 text-sky-600" />
              <span>Import Progress Backup</span>
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className={`p-3 rounded-md text-xs border ${
            importStatus.success 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200'
          }`}>
            {importStatus.msg}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-l-rose-500 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-rose-700 dark:text-rose-400">
            Reset Stored Data
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Permanently clear all local bookmarks, attempt history, and incorrect questions on this device.
          </p>
        </div>

        {!showResetConfirm ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => setShowResetConfirm(true)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear All Data
          </Button>
        ) : (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-md border border-rose-200 dark:border-rose-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Are you sure? This action cannot be undone.</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="danger" onClick={handleReset}>
                Yes, Permanently Delete
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

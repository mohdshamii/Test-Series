import React from 'react';

interface NotebookCellProps {
  type?: 'input' | 'output' | 'markdown';
  executionIndex?: number | string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isFocused?: boolean;
}

export const NotebookCell: React.FC<NotebookCellProps> = ({
  type = 'input',
  executionIndex = 1,
  headerRight,
  children,
  className = '',
  isFocused = false
}) => {
  return (
    <div 
      className={`notebook-cell relative transition-all duration-150 ${
        isFocused ? 'ring-2 ring-sky-500/50 border-sky-400 dark:border-sky-600' : ''
      } ${className}`}
    >
      {/* Top micro toolbar if provided */}
      {headerRight && (
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span 
              className={`notebook-prompt ${
                type === 'input' ? 'prompt-in' : type === 'output' ? 'prompt-out' : 'text-slate-400'
              }`}
            >
              {type === 'input' ? `In [${executionIndex}]:` : type === 'output' ? `Out [${executionIndex}]:` : 'Md:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
          </div>
        </div>
      )}

      {/* Main Cell Body with Gutter */}
      <div className="flex items-start">
        {!headerRight && (
          <div className="w-16 shrink-0 pt-3.5 pr-2 text-right hidden sm:block select-none">
            <span 
              className={`notebook-prompt ${
                type === 'input' ? 'prompt-in' : type === 'output' ? 'prompt-out' : 'text-slate-400'
              }`}
            >
              {type === 'input' ? `In [${executionIndex}]:` : type === 'output' ? `Out [${executionIndex}]:` : ''}
            </span>
          </div>
        )}

        <div className="flex-1 p-4 sm:p-5 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

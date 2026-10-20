import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * Parses markdown-like text containing inline math ($...$) and block math ($$...$$)
 * and renders KaTeX with fallback for any parsing errors.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '', inline = false }) => {
  const parts = useMemo(() => {
    if (!text) return [];

    // Split text by block math $$...$$ first, then inline math $...$
    // Regex matches $$...$$ or $...$
    const tokens: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];
    
    // Pattern matches $$...$$ (group 1) or $...$ (group 2)
    const regex = /\$\$([\s\S]*?)\$\$|\$((?:\\.|[^$\\])+)\$/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }

      if (match[1] !== undefined) {
        // Block math $$...$$
        tokens.push({
          type: 'block-math',
          content: match[1]
        });
      } else if (match[2] !== undefined) {
        // Inline math $...$
        tokens.push({
          type: 'inline-math',
          content: match[2]
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return tokens;
  }, [text]);

  const renderMath = (math: string, displayMode: boolean) => {
    try {
      const html = katex.renderToString(math.trim(), {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
      return (
        <span 
          className={displayMode ? "block my-2 overflow-x-auto text-center" : "inline-block align-middle mx-0.5"}
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      );
    } catch {
      return <span className="font-mono text-xs bg-red-50 text-red-700 px-1 rounded">{math}</span>;
    }
  };

  const renderFormattedText = (textContent: string) => {
    // Process newlines and bold **text** or `code`
    const lines = textContent.split('\n');
    return lines.map((line, lineIdx) => {
      // Split on `code` or **bold**
      const inlineParts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={lineIdx}>
          {inlineParts.map((sub, subIdx) => {
            if (sub.startsWith('`') && sub.endsWith('`')) {
              return (
                <code 
                  key={subIdx} 
                  className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                >
                  {sub.slice(1, -1)}
                </code>
              );
            }
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return <strong key={subIdx} className="font-semibold text-slate-900 dark:text-slate-100">{sub.slice(2, -2)}</strong>;
            }
            return <span key={subIdx}>{sub}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  if (inline) {
    return (
      <span className={`inline ${className}`}>
        {parts.map((p, i) => {
          if (p.type === 'inline-math') return <React.Fragment key={i}>{renderMath(p.content, false)}</React.Fragment>;
          if (p.type === 'block-math') return <React.Fragment key={i}>{renderMath(p.content, true)}</React.Fragment>;
          return <React.Fragment key={i}>{renderFormattedText(p.content)}</React.Fragment>;
        })}
      </span>
    );
  }

  return (
    <div className={`leading-relaxed ${className}`}>
      {parts.map((p, i) => {
        if (p.type === 'inline-math') return <React.Fragment key={i}>{renderMath(p.content, false)}</React.Fragment>;
        if (p.type === 'block-math') return <React.Fragment key={i}>{renderMath(p.content, true)}</React.Fragment>;
        return <React.Fragment key={i}>{renderFormattedText(p.content)}</React.Fragment>;
      })}
    </div>
  );
};

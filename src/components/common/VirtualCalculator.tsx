import React, { useState } from 'react';
import { X, RotateCcw, Calculator as CalcIcon } from 'lucide-react';

interface VirtualCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualCalculator: React.FC<VirtualCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [isRad, setIsRad] = useState(true);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    setDisplay(prev => (prev === '0' || prev === 'Error') ? digit : prev + digit);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setHistory('');
  };

  const handleBackspace = () => {
    setDisplay(prev => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const handleOperator = (op: string) => {
    setHistory(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEquals = () => {
    try {
      const fullExpr = history + display;
      // Sanitize expression: only allow numbers, math operators, parens, decimal
      const sanitized = fullExpr.replace(/[^0-9+\-*/().]/g, '');
      // Evaluate using Function rather than direct eval
      const result = new Function(`return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(8))));
      setHistory('');
    } catch {
      setDisplay('Error');
    }
  };

  const handleScientific = (func: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      switch (func) {
        case 'sin':
          res = Math.sin(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'cos':
          res = Math.cos(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'tan':
          res = Math.tan(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'asin':
          res = Math.asin(val);
          if (!isRad) res = (res * 180) / Math.PI;
          break;
        case 'acos':
          res = Math.acos(val);
          if (!isRad) res = (res * 180) / Math.PI;
          break;
        case 'atan':
          res = Math.atan(val);
          if (!isRad) res = (res * 180) / Math.PI;
          break;
        case 'ln':
          res = Math.log(val);
          break;
        case 'log10':
          res = Math.log10(val);
          break;
        case 'sqrt':
          res = Math.sqrt(val);
          break;
        case 'sqr':
          res = Math.pow(val, 2);
          break;
        case 'cube':
          res = Math.pow(val, 3);
          break;
        case 'exp':
          res = Math.exp(val);
          break;
        case 'inv':
          res = 1 / val;
          break;
        case 'fact': {
          let n = Math.floor(val);
          if (n < 0 || n > 170) throw new Error('Out of range');
          let f = 1;
          for (let i = 2; i <= n; i++) f *= i;
          res = f;
          break;
        }
        case 'pi':
          res = Math.PI;
          break;
        case 'e':
          res = Math.E;
          break;
      }
      setDisplay(String(Number(res.toFixed(8))));
    } catch {
      setDisplay('Error');
    }
  };

  const handleMemory = (action: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    const val = parseFloat(display) || 0;
    switch (action) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'MS':
        setMemory(val);
        break;
      case 'M+':
        setMemory(prev => prev + val);
        break;
      case 'M-':
        setMemory(prev => prev - val);
        break;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden text-xs select-none">
      {/* Header */}
      <div className="bg-slate-800 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <CalcIcon className="w-4 h-4 text-sky-400" />
          <span>GATE Virtual Scientific Calculator</span>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded transition"
          aria-label="Close calculator"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen */}
      <div className="p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="text-right text-slate-500 font-mono text-[11px] h-4 overflow-hidden truncate">
          {history || '\u00A0'}
        </div>
        <div className="text-right font-mono text-xl font-bold text-slate-900 dark:text-white truncate">
          {display}
        </div>
        <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsRad(true)}
              className={`px-1.5 py-0.5 rounded ${isRad ? 'bg-sky-600 text-white font-bold' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              RAD
            </button>
            <button 
              onClick={() => setIsRad(false)}
              className={`px-1.5 py-0.5 rounded ${!isRad ? 'bg-sky-600 text-white font-bold' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              DEG
            </button>
          </div>
          <span className="font-mono">M: {memory !== 0 ? memory : '0'}</span>
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="p-2 grid grid-cols-5 gap-1 bg-slate-50 dark:bg-slate-900">
        {/* Row 1: Memory */}
        <button onClick={() => handleMemory('MC')} className="calc-btn-fn">MC</button>
        <button onClick={() => handleMemory('MR')} className="calc-btn-fn">MR</button>
        <button onClick={() => handleMemory('MS')} className="calc-btn-fn">MS</button>
        <button onClick={() => handleMemory('M+')} className="calc-btn-fn">M+</button>
        <button onClick={() => handleMemory('M-')} className="calc-btn-fn">M-</button>

        {/* Row 2: Trig / Log */}
        <button onClick={() => handleScientific('sin')} className="calc-btn-fn">sin</button>
        <button onClick={() => handleScientific('cos')} className="calc-btn-fn">cos</button>
        <button onClick={() => handleScientific('tan')} className="calc-btn-fn">tan</button>
        <button onClick={() => handleScientific('ln')} className="calc-btn-fn">ln</button>
        <button onClick={() => handleScientific('log10')} className="calc-btn-fn">log</button>

        {/* Row 3: Inverse Trig & Powers */}
        <button onClick={() => handleScientific('asin')} className="calc-btn-fn">sin⁻¹</button>
        <button onClick={() => handleScientific('acos')} className="calc-btn-fn">cos⁻¹</button>
        <button onClick={() => handleScientific('atan')} className="calc-btn-fn">tan⁻¹</button>
        <button onClick={() => handleScientific('sqrt')} className="calc-btn-fn">√x</button>
        <button onClick={() => handleScientific('sqr')} className="calc-btn-fn">x²</button>

        {/* Row 4: Constants & Ops */}
        <button onClick={() => handleScientific('pi')} className="calc-btn-fn">π</button>
        <button onClick={() => handleScientific('e')} className="calc-btn-fn">e</button>
        <button onClick={() => handleScientific('fact')} className="calc-btn-fn">n!</button>
        <button onClick={() => handleScientific('inv')} className="calc-btn-fn">1/x</button>
        <button onClick={handleBackspace} className="calc-btn-fn text-red-600 dark:text-red-400">⌫</button>

        {/* Row 5: 7 8 9 / Clear */}
        <button onClick={() => handleDigit('7')} className="calc-btn-num">7</button>
        <button onClick={() => handleDigit('8')} className="calc-btn-num">8</button>
        <button onClick={() => handleDigit('9')} className="calc-btn-num">9</button>
        <button onClick={() => handleOperator('/')} className="calc-btn-op">÷</button>
        <button onClick={handleClear} className="calc-btn-fn text-red-600 dark:text-red-400 font-bold">C</button>

        {/* Row 6: 4 5 6 * ( */}
        <button onClick={() => handleDigit('4')} className="calc-btn-num">4</button>
        <button onClick={() => handleDigit('5')} className="calc-btn-num">5</button>
        <button onClick={() => handleDigit('6')} className="calc-btn-num">6</button>
        <button onClick={() => handleOperator('*')} className="calc-btn-op">×</button>
        <button onClick={() => handleDigit('(')} className="calc-btn-fn">(</button>

        {/* Row 7: 1 2 3 - ) */}
        <button onClick={() => handleDigit('1')} className="calc-btn-num">1</button>
        <button onClick={() => handleDigit('2')} className="calc-btn-num">2</button>
        <button onClick={() => handleDigit('3')} className="calc-btn-num">3</button>
        <button onClick={() => handleOperator('-')} className="calc-btn-op">−</button>
        <button onClick={() => handleDigit(')')} className="calc-btn-fn">)</button>

        {/* Row 8: 0 . +/- + = */}
        <button onClick={() => handleDigit('0')} className="calc-btn-num">0</button>
        <button onClick={handleDecimal} className="calc-btn-num font-bold">.</button>
        <button 
          onClick={() => setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev)} 
          className="calc-btn-num"
        >
          ±
        </button>
        <button onClick={() => handleOperator('+')} className="calc-btn-op">+</button>
        <button onClick={handleEquals} className="bg-sky-600 hover:bg-sky-500 text-white font-bold rounded py-1.5 transition">
          =
        </button>
      </div>

      <style>{`
        .calc-btn-fn {
          background-color: #e2e8f0;
          color: #334155;
          padding: 6px 0;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.1s;
        }
        .dark .calc-btn-fn {
          background-color: #1e293b;
          color: #cbd5e1;
        }
        .calc-btn-fn:hover {
          background-color: #cbd5e1;
        }
        .dark .calc-btn-fn:hover {
          background-color: #334155;
        }
        .calc-btn-num {
          background-color: #ffffff;
          color: #0f172a;
          padding: 6px 0;
          border-radius: 4px;
          font-weight: 600;
          font-size: 13px;
          border: 1px solid #e2e8f0;
          transition: background-color 0.1s;
        }
        .dark .calc-btn-num {
          background-color: #0f172a;
          color: #f8fafc;
          border-color: #334155;
        }
        .calc-btn-num:hover {
          background-color: #f1f5f9;
        }
        .dark .calc-btn-num:hover {
          background-color: #1e293b;
        }
        .calc-btn-op {
          background-color: #f8fafc;
          color: #0284c7;
          font-size: 14px;
          font-weight: bold;
          padding: 6px 0;
          border-radius: 4px;
          border: 1px solid #bae6fd;
          transition: background-color 0.1s;
        }
        .dark .calc-btn-op {
          background-color: #082f49;
          color: #38bdf8;
          border-color: #0369a1;
        }
        .calc-btn-op:hover {
          background-color: #e0f2fe;
        }
      `}</style>
    </div>
  );
};

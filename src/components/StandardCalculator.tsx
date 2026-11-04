import React, { useState, useEffect, useCallback } from 'react';
import { Delete, Copy, Check, RotateCcw } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { evaluateExpression } from '../utils/mathEvaluator.ts';
import { formatLocalizedNumber, toBengaliNumber } from '../utils/bengali.ts';
import { playKeyClick } from '../utils/audio.ts';

interface StandardCalculatorProps {
  lang: Language;
  soundEnabled: boolean;
  onAddHistory: (item: CalculationHistoryItem) => void;
  initialValue?: string;
}

export const StandardCalculator: React.FC<StandardCalculatorProps> = ({
  lang,
  soundEnabled,
  onAddHistory,
  initialValue
}) => {
  const t = TRANSLATIONS[lang];

  const [expression, setExpression] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial value if passed from history
  useEffect(() => {
    if (initialValue) {
      setCurrentValue(initialValue);
      setExpression('');
      setIsCalculated(false);
    }
  }, [initialValue]);

  // Handle number click
  const handleDigit = useCallback((digit: string) => {
    playKeyClick('num', soundEnabled);
    setError(null);

    if (isCalculated) {
      setCurrentValue(digit);
      setExpression('');
      setIsCalculated(false);
      return;
    }

    if (currentValue === '0' && digit !== '.') {
      setCurrentValue(digit);
    } else {
      if (digit === '.' && currentValue.includes('.')) return;
      setCurrentValue((prev) => prev + digit);
    }
  }, [currentValue, isCalculated, soundEnabled]);

  // Handle Operator
  const handleOperator = useCallback((op: string) => {
    playKeyClick('op', soundEnabled);
    setError(null);

    let displayOp = op;
    if (op === '*') displayOp = '×';
    if (op === '/') displayOp = '÷';
    if (op === '-') displayOp = '−';

    if (isCalculated) {
      setExpression(`${currentValue} ${displayOp} `);
      setCurrentValue('0');
      setIsCalculated(false);
      return;
    }

    if (currentValue !== '0' || expression === '') {
      setExpression((prev) => `${prev}${currentValue} ${displayOp} `);
      setCurrentValue('0');
    } else if (expression.length > 0) {
      // Replace last operator
      setExpression((prev) => prev.trimEnd().replace(/[\+\−\×\÷]$/, displayOp) + ' ');
    }
  }, [currentValue, expression, isCalculated, soundEnabled]);

  // Handle Equals
  const handleEquals = useCallback(() => {
    playKeyClick('equals', soundEnabled);
    try {
      const fullExpression = expression + currentValue;
      if (!fullExpression.trim()) return;

      const evalResult = evaluateExpression(fullExpression);
      const formatted = String(evalResult);

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        expression: fullExpression,
        result: formatted,
        timestamp: Date.now(),
        mode: 'standard'
      });

      setCurrentValue(formatted);
      setExpression(fullExpression + ' =');
      setIsCalculated(true);
      setError(null);
    } catch {
      setError(lang === 'bn' ? 'ভুল ইনপুট' : 'Syntax Error');
      playKeyClick('action', soundEnabled);
    }
  }, [expression, currentValue, lang, onAddHistory, soundEnabled]);

  // Handle Clear
  const handleClear = useCallback(() => {
    playKeyClick('action', soundEnabled);
    setCurrentValue('0');
    setError(null);
  }, [soundEnabled]);

  // Handle All Clear
  const handleAllClear = useCallback(() => {
    playKeyClick('action', soundEnabled);
    setCurrentValue('0');
    setExpression('');
    setError(null);
    setIsCalculated(false);
  }, [soundEnabled]);

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    playKeyClick('action', soundEnabled);
    if (isCalculated) {
      setCurrentValue('0');
      setExpression('');
      setIsCalculated(false);
      return;
    }
    if (currentValue.length > 1) {
      setCurrentValue((prev) => prev.slice(0, -1));
    } else {
      setCurrentValue('0');
    }
  }, [currentValue, isCalculated, soundEnabled]);

  // Handle Plus / Minus Toggle
  const handlePlusMinus = useCallback(() => {
    playKeyClick('action', soundEnabled);
    if (currentValue === '0') return;
    if (currentValue.startsWith('-')) {
      setCurrentValue((prev) => prev.substring(1));
    } else {
      setCurrentValue((prev) => '-' + prev);
    }
  }, [currentValue, soundEnabled]);

  // Handle Percent
  const handlePercent = useCallback(() => {
    playKeyClick('op', soundEnabled);
    try {
      const val = parseFloat(currentValue);
      if (isNaN(val)) return;
      const res = val / 100;
      setCurrentValue(String(res));
    } catch {
      setError('Error');
    }
  }, [currentValue, soundEnabled]);

  // Handle Square Root
  const handleSquareRoot = useCallback(() => {
    playKeyClick('op', soundEnabled);
    try {
      const val = parseFloat(currentValue);
      if (val < 0) {
        setError(lang === 'bn' ? 'অবাস্তব সংখ্যা' : 'Invalid');
        return;
      }
      const res = Math.sqrt(val);
      setCurrentValue(String(res));
      setExpression(`√(${val}) =`);
      setIsCalculated(true);
    } catch {
      setError('Error');
    }
  }, [currentValue, lang, soundEnabled]);

  // Memory functions
  const handleMemoryAdd = () => {
    playKeyClick('action', soundEnabled);
    const val = parseFloat(currentValue);
    if (!isNaN(val)) setMemory((prev) => prev + val);
  };
  const handleMemorySub = () => {
    playKeyClick('action', soundEnabled);
    const val = parseFloat(currentValue);
    if (!isNaN(val)) setMemory((prev) => prev - val);
  };
  const handleMemoryRecall = () => {
    playKeyClick('action', soundEnabled);
    setCurrentValue(String(memory));
    setIsCalculated(false);
  };
  const handleMemoryClear = () => {
    playKeyClick('action', soundEnabled);
    setMemory(0);
  };
  const handleMemoryStore = () => {
    playKeyClick('action', soundEnabled);
    const val = parseFloat(currentValue);
    if (!isNaN(val)) setMemory(val);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input field elsewhere
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key;
      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        handleDigit('.');
      } else if (key === '+' || key === '-') {
        e.preventDefault();
        handleOperator(key);
      } else if (key === '*') {
        e.preventDefault();
        handleOperator('*');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleAllClear, handlePercent]);

  // Display formatting
  const displayValue = lang === 'bn' ? toBengaliNumber(currentValue) : currentValue;
  const displayExpression = lang === 'bn' ? toBengaliNumber(expression) : expression;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Screen / Display Area */}
      <div className="relative bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800/80 mb-5 flex flex-col justify-between min-h-[120px] transition-colors">
        {/* Memory and status indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {memory !== 0 && (
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                M ({lang === 'bn' ? toBengaliNumber(memory) : memory})
              </span>
            )}
            {error && (
              <span className="text-rose-500 font-semibold">{error}</span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-[11px] p-1 rounded"
            title={copied ? t.common.copied : t.common.copy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">{t.common.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.common.copy}</span>
              </>
            )}
          </button>
        </div>

        {/* Previous expression preview */}
        <div className="text-right text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none min-h-[20px] mt-1">
          {displayExpression}
        </div>

        {/* Primary Result Display */}
        <div className="text-right font-mono font-bold tracking-tight text-slate-900 dark:text-white overflow-x-auto whitespace-nowrap scrollbar-none mt-1">
          <span className={`tabular-nums ${displayValue.length > 10 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
            {displayValue}
          </span>
        </div>
      </div>

      {/* Memory Control Row */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {[
          { label: 'MC', action: handleMemoryClear },
          { label: 'MR', action: handleMemoryRecall },
          { label: 'M+', action: handleMemoryAdd },
          { label: 'M-', action: handleMemorySub },
          { label: 'MS', action: handleMemoryStore },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className="h-9 rounded-lg text-xs font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Main Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Row 1 */}
        <button
          onClick={handleAllClear}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-sm sm:text-base font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/60 active:scale-95"
          title="All Clear (Esc)"
        >
          AC
        </button>
        <button
          onClick={handleClear}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-sm sm:text-base font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
          title="Clear Entry"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl flex items-center justify-center font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
          title="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleOperator('/')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit('7')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৭' : '7'}
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৮' : '8'}
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৯' : '9'}
        </button>
        <button
          onClick={() => handleOperator('*')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit('4')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৪' : '4'}
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৫' : '5'}
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৬' : '6'}
        </button>
        <button
          onClick={() => handleOperator('-')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit('1')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '১' : '1'}
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '২' : '2'}
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৩' : '3'}
        </button>
        <button
          onClick={() => handleOperator('+')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={handlePlusMinus}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
          title="Positive / Negative"
        >
          ±
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-semibold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '০' : '0'}
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-lg sm:text-xl font-bold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="min-h-[50px] sm:min-h-[56px] rounded-2xl text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
          title="Calculate (= or Enter)"
        >
          =
        </button>
      </div>

      {/* Auxiliary Row for Quick Functions */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mt-2.5 sm:mt-3">
        <button
          onClick={() => {
            playKeyClick('op', soundEnabled);
            setExpression((prev) => prev + '(');
          }}
          className="h-10 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/50"
        >
          (
        </button>
        <button
          onClick={() => {
            playKeyClick('op', soundEnabled);
            setExpression((prev) => prev + ')');
          }}
          className="h-10 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/50"
        >
          )
        </button>
        <button
          onClick={handlePercent}
          className="h-10 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/50"
        >
          %
        </button>
        <button
          onClick={handleSquareRoot}
          className="h-10 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/50"
        >
          √x
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Delete, Copy, Check } from 'lucide-react';
import { Language, CalculationHistoryItem, AngleMode } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { evaluateExpression } from '../utils/mathEvaluator.ts';
import { toBengaliNumber } from '../utils/bengali.ts';
import { playKeyClick } from '../utils/audio.ts';

interface ScientificCalculatorProps {
  lang: Language;
  soundEnabled: boolean;
  onAddHistory: (item: CalculationHistoryItem) => void;
  initialValue?: string;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  lang,
  soundEnabled,
  onAddHistory,
  initialValue
}) => {
  const t = TRANSLATIONS[lang];

  const [expression, setExpression] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isSecondFunc, setIsSecondFunc] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValue) {
      setCurrentValue(initialValue);
      setExpression('');
      setIsCalculated(false);
    }
  }, [initialValue]);

  // Insert token or digit
  const handleDigit = useCallback((d: string) => {
    playKeyClick('num', soundEnabled);
    setError(null);

    if (isCalculated) {
      setCurrentValue(d);
      setExpression('');
      setIsCalculated(false);
      return;
    }

    if (currentValue === '0' && d !== '.') {
      setCurrentValue(d);
    } else {
      if (d === '.' && currentValue.includes('.')) return;
      setCurrentValue((prev) => prev + d);
    }
  }, [currentValue, isCalculated, soundEnabled]);

  // Operator
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
      setExpression((prev) => prev.trimEnd().replace(/[\+\−\×\÷\^]$/, displayOp) + ' ');
    }
  }, [currentValue, expression, isCalculated, soundEnabled]);

  // Special math function
  const handleFunc = (func: string) => {
    playKeyClick('op', soundEnabled);
    setError(null);

    if (func === 'sq') {
      // x^2
      setExpression((prev) => `${prev}(${currentValue})^2`);
      setCurrentValue('0');
    } else if (func === 'cube') {
      // x^3
      setExpression((prev) => `${prev}(${currentValue})^3`);
      setCurrentValue('0');
    } else if (func === 'power') {
      // x^y
      setExpression((prev) => `${prev}${currentValue} ^ `);
      setCurrentValue('0');
    } else if (func === 'inv') {
      // 1/x
      setExpression((prev) => `${prev}(1 / ${currentValue})`);
      setCurrentValue('0');
    } else if (func === 'fact') {
      // n!
      setExpression((prev) => `${prev}(${currentValue})!`);
      setCurrentValue('0');
    } else if (func === 'pi') {
      setCurrentValue(String(Math.PI));
    } else if (func === 'e') {
      setCurrentValue(String(Math.E));
    } else {
      // Prefix functions like sin, cos, tan, ln, log, sqrt, abs
      setExpression((prev) => `${prev}${func}(`);
      setCurrentValue('0');
    }
  };

  // Evaluate
  const handleEquals = useCallback(() => {
    playKeyClick('equals', soundEnabled);
    try {
      const fullExpression = expression + (currentValue !== '0' ? currentValue : '');
      if (!fullExpression.trim()) return;

      const evalResult = evaluateExpression(fullExpression, angleMode);
      const formatted = String(evalResult);

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        expression: fullExpression,
        result: formatted,
        timestamp: Date.now(),
        mode: 'scientific'
      });

      setCurrentValue(formatted);
      setExpression(fullExpression + ' =');
      setIsCalculated(true);
      setError(null);
    } catch {
      setError(lang === 'bn' ? 'গণনা ত্রুটি' : 'Math Error');
      playKeyClick('action', soundEnabled);
    }
  }, [expression, currentValue, angleMode, lang, onAddHistory, soundEnabled]);

  const handleAllClear = useCallback(() => {
    playKeyClick('action', soundEnabled);
    setCurrentValue('0');
    setExpression('');
    setError(null);
    setIsCalculated(false);
  }, [soundEnabled]);

  const handleClear = useCallback(() => {
    playKeyClick('action', soundEnabled);
    setCurrentValue('0');
    setError(null);
  }, [soundEnabled]);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleAllClear]);

  const displayValue = lang === 'bn' ? toBengaliNumber(currentValue) : currentValue;
  const displayExpression = lang === 'bn' ? toBengaliNumber(expression) : expression;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Display Screen */}
      <div className="relative bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800/80 mb-5 flex flex-col justify-between min-h-[125px] transition-colors">
        {/* Top Indicators */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playKeyClick('action', soundEnabled);
                setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
              }}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 cursor-pointer"
            >
              {angleMode}
            </button>
            {memory !== 0 && (
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                M ({lang === 'bn' ? toBengaliNumber(memory) : memory})
              </span>
            )}
            {error && <span className="text-rose-500 font-semibold">{error}</span>}
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

        {/* Formula line */}
        <div className="text-right text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none min-h-[22px] mt-1">
          {displayExpression}
        </div>

        {/* Big Result Output */}
        <div className="text-right font-mono font-bold tracking-tight text-slate-900 dark:text-white overflow-x-auto whitespace-nowrap scrollbar-none mt-1">
          <span className={`tabular-nums ${displayValue.length > 12 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
            {displayValue}
          </span>
        </div>
      </div>

      {/* Function Toggle bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playKeyClick('action', soundEnabled);
              setIsSecondFunc((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-colors cursor-pointer border ${
              isSecondFunc
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isSecondFunc ? '2nd Active' : '2nd'}
          </button>
          <button
            onClick={() => {
              playKeyClick('action', soundEnabled);
              setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {angleMode === 'DEG' ? 'Rad' : 'Deg'}
          </button>
        </div>

        {/* Memory Row in scientific */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playKeyClick('action', soundEnabled);
              setMemory(0);
            }}
            className="px-2 py-1 text-[11px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
          >
            MC
          </button>
          <button
            onClick={() => {
              playKeyClick('action', soundEnabled);
              setCurrentValue(String(memory));
            }}
            className="px-2 py-1 text-[11px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
          >
            MR
          </button>
          <button
            onClick={() => {
              playKeyClick('action', soundEnabled);
              const val = parseFloat(currentValue);
              if (!isNaN(val)) setMemory((m) => m + val);
            }}
            className="px-2 py-1 text-[11px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
          >
            M+
          </button>
        </div>
      </div>

      {/* Grid: 5 columns on mobile, 5 or 6 columns for desktop */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {/* Row 1 Scientific Functions */}
        <button
          onClick={() => handleFunc(isSecondFunc ? 'asin' : 'sin')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/40"
        >
          {isSecondFunc ? 'sin⁻¹' : 'sin'}
        </button>
        <button
          onClick={() => handleFunc(isSecondFunc ? 'acos' : 'cos')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/40"
        >
          {isSecondFunc ? 'cos⁻¹' : 'cos'}
        </button>
        <button
          onClick={() => handleFunc(isSecondFunc ? 'atan' : 'tan')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/40"
        >
          {isSecondFunc ? 'tan⁻¹' : 'tan'}
        </button>
        <button
          onClick={() => handleFunc(isSecondFunc ? 'e' : 'ln')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/40"
        >
          {isSecondFunc ? 'eˣ' : 'ln'}
        </button>
        <button
          onClick={() => handleFunc(isSecondFunc ? 'power' : 'log')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/40"
        >
          {isSecondFunc ? '10ˣ' : 'log'}
        </button>

        {/* Row 2 Powers and Roots */}
        <button
          onClick={() => handleFunc('sq')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          x²
        </button>
        <button
          onClick={() => handleFunc('power')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          xʸ
        </button>
        <button
          onClick={() => handleFunc('sqrt')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          √x
        </button>
        <button
          onClick={() => handleFunc('cbrt')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          ∛x
        </button>
        <button
          onClick={() => handleFunc('inv')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          1/x
        </button>

        {/* Row 3 Constants & Symbols */}
        <button
          onClick={() => handleFunc('pi')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          π
        </button>
        <button
          onClick={() => handleFunc('e')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          e
        </button>
        <button
          onClick={() => handleFunc('fact')}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          n!
        </button>
        <button
          onClick={() => {
            playKeyClick('op', soundEnabled);
            setExpression((prev) => prev + '(');
          }}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          (
        </button>
        <button
          onClick={() => {
            playKeyClick('op', soundEnabled);
            setExpression((prev) => prev + ')');
          }}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold font-mono bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
        >
          )
        </button>

        {/* Row 4 Clear & Digits */}
        <button
          onClick={handleAllClear}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/60 active:scale-95"
        >
          AC
        </button>
        <button
          onClick={() => handleDigit('7')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৭' : '7'}
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৮' : '8'}
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৯' : '9'}
        </button>
        <button
          onClick={() => handleOperator('/')}
          className="h-11 sm:h-12 rounded-xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          ÷
        </button>

        {/* Row 5 */}
        <button
          onClick={handleClear}
          className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
        >
          C
        </button>
        <button
          onClick={() => handleDigit('4')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৪' : '4'}
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৫' : '5'}
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৬' : '6'}
        </button>
        <button
          onClick={() => handleOperator('*')}
          className="h-11 sm:h-12 rounded-xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          ×
        </button>

        {/* Row 6 */}
        <button
          onClick={handleBackspace}
          className="h-11 sm:h-12 rounded-xl flex items-center justify-center font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDigit('1')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '১' : '1'}
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '২' : '2'}
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '৩' : '3'}
        </button>
        <button
          onClick={() => handleOperator('-')}
          className="h-11 sm:h-12 rounded-xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          −
        </button>

        {/* Row 7 */}
        <button
          onClick={() => {
            playKeyClick('action', soundEnabled);
            if (currentValue !== '0') {
              setCurrentValue((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
            }
          }}
          className="h-11 sm:h-12 rounded-xl text-base font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
        >
          ±
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          {lang === 'bn' ? '০' : '0'}
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="h-11 sm:h-12 rounded-xl text-base sm:text-lg font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700/70 shadow-xs active:scale-95"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-11 sm:h-12 rounded-xl text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
          title="Calculate (=)"
        >
          =
        </button>
        <button
          onClick={() => handleOperator('+')}
          className="h-11 sm:h-12 rounded-xl text-lg sm:text-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
};

import React, { useState, useId } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { Language, CurrencySymbol } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { formatLocalizedNumber, toBengaliNumber } from '../utils/bengali.ts';
import { playKeyClick } from '../utils/audio.ts';

interface TipSplitCalculatorProps {
  lang: Language;
  soundEnabled: boolean;
}

export const TipSplitCalculator: React.FC<TipSplitCalculatorProps> = ({ lang, soundEnabled }) => {
  const t = TRANSLATIONS[lang];
  const billAmountInputId = useId();
  const customTipInputId = useId();
  const peopleCountInputId = useId();

  const [billAmount, setBillAmount] = useState<number>(1200);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [currency, setCurrency] = useState<CurrencySymbol>('৳');

  const tipPresets = [0, 5, 10, 15, 20];

  const totalTip = (billAmount * tipPercent) / 100;
  const totalBill = billAmount + totalTip;
  const perPersonBill = peopleCount > 0 ? billAmount / peopleCount : billAmount;
  const perPersonTip = peopleCount > 0 ? totalTip / peopleCount : totalTip;
  const perPersonTotal = peopleCount > 0 ? totalBill / peopleCount : totalBill;

  const handlePeopleChange = (delta: number) => {
    playKeyClick('action', soundEnabled);
    setPeopleCount((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.tip.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tip.subtitle}
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-auto p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          {(['৳', '$', '€', '£', '₹'] as CurrencySymbol[]).map((cur) => (
            <button
              key={cur}
              onClick={() => setCurrency(cur)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                currency === cur
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cur}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input Controls */}
        <div className="space-y-5">
          {/* Bill Input */}
          <div className="space-y-1.5">
            <label htmlFor={billAmountInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.tip.billAmount}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold font-mono text-lg">
                {currency}
              </span>
              <input
                id={billAmountInputId}
                type="number"
                min="0"
                step="10"
                value={billAmount || ''}
                onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-10 pr-4 py-3 text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Tip Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t.tip.tipPercent}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {lang === 'bn' ? toBengaliNumber(tipPercent) : tipPercent}%
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {tipPresets.map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    playKeyClick('action', soundEnabled);
                    setTipPercent(pct);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                    tipPercent === pct
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang === 'bn' ? toBengaliNumber(pct) : pct}%
                </button>
              ))}
            </div>

            {/* Custom slider */}
            <input
              id={customTipInputId}
              aria-label={t.tip.tipPercent}
              type="range"
              min="0"
              max="50"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer mt-1"
            />
          </div>

          {/* Number of People */}
          <div className="space-y-1.5">
            <label htmlFor={peopleCountInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{t.tip.numPeople}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePeopleChange(-1)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer active:scale-95 transition-all"
                title="Decrease"
                aria-label="Decrease people count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                id={peopleCountInputId}
                aria-label={t.tip.numPeople}
                type="number"
                min="1"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 py-3 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={() => handlePeopleChange(1)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer active:scale-95 transition-all"
                title="Increase"
                aria-label="Increase people count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
          {/* Main per person highlight */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t.tip.totalPerPerson}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                {currency} {formatLocalizedNumber(perPersonTotal, lang, 2)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/{lang === 'bn' ? 'জন' : 'person'}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>{t.tip.billPerPerson}</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {currency} {formatLocalizedNumber(perPersonBill, lang, 2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>{t.tip.tipPerPerson}</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {currency} {formatLocalizedNumber(perPersonTip, lang, 2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 font-semibold text-slate-900 dark:text-white">
              <span>{t.tip.totalBillWithTip}</span>
              <span className="font-mono text-base">
                {currency} {formatLocalizedNumber(totalBill, lang, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

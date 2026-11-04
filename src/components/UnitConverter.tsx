import React, { useState, useId } from 'react';
import { ArrowLeftRight, Copy, Check, Info } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { UNIT_CATEGORIES } from '../utils/unitsData.ts';
import { formatLocalizedNumber, toBengaliNumber } from '../utils/bengali.ts';
import { playKeyClick } from '../utils/audio.ts';

interface UnitConverterProps {
  lang: Language;
  soundEnabled: boolean;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ lang, soundEnabled }) => {
  const t = TRANSLATIONS[lang];
  const fromValueInputId = useId();
  const toValueInputId = useId();

  const [selectedCatId, setSelectedCatId] = useState<string>('length');
  const currentCategory = UNIT_CATEGORIES.find((c) => c.id === selectedCatId) || UNIT_CATEGORIES[0];

  const [fromUnitId, setFromUnitId] = useState<string>(currentCategory.units[0].id);
  const [toUnitId, setToUnitId] = useState<string>(currentCategory.units[1]?.id || currentCategory.units[0].id);
  const [inputValue, setInputValue] = useState<string>('1');
  const [copied, setCopied] = useState<boolean>(false);

  // When category changes, reset units
  const handleCategoryChange = (catId: string) => {
    playKeyClick('action', soundEnabled);
    setSelectedCatId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length > 1) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  // Find units
  const fromUnit = currentCategory.units.find((u) => u.id === fromUnitId) || currentCategory.units[0];
  const toUnit = currentCategory.units.find((u) => u.id === toUnitId) || currentCategory.units[1] || currentCategory.units[0];

  // Calculate result
  const numericInput = parseFloat(inputValue);
  let convertedResult = 0;
  if (!isNaN(numericInput)) {
    const baseVal = fromUnit.toBase(numericInput);
    convertedResult = toUnit.fromBase(baseVal);
  }

  // Swap units
  const handleSwap = () => {
    playKeyClick('action', soundEnabled);
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(String(convertedResult));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.units.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {lang === 'bn' 
            ? 'আন্তর্জাতিক ও দেশীয় পরিমাপ (সোনার ভরি, জমির কাঠা/বিঘা/শতক) সহজে রূপান্তর করুন।' 
            : 'Convert standard metric, imperial and local units accurately in real-time.'}
        </p>
      </div>

      {/* Category Pills Slider */}
      <div className="w-full overflow-x-auto pb-3 mb-6 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 min-w-max">
          {UNIT_CATEGORIES.map((cat) => {
            const isActive = cat.id === selectedCatId;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {lang === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversion Cards Box */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70">
        {/* From Side */}
        <div className="flex flex-col gap-2">
          <label htmlFor={fromValueInputId} className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.units.from}
          </label>
          <div className="flex flex-col gap-2">
            <input
              id={fromValueInputId}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 text-xl font-bold font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
            <select
              aria-label={t.units.from}
              value={fromUnitId}
              onChange={(e) => {
                playKeyClick('action', soundEnabled);
                setFromUnitId(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {currentCategory.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {lang === 'bn' ? unit.nameBn : unit.nameEn} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center md:pt-6">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer active:scale-95 transition-all"
            title={t.units.swap}
            aria-label="Swap Units"
          >
            <ArrowLeftRight className="w-4 h-4 md:rotate-0" />
          </button>
        </div>

        {/* To Side */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor={toValueInputId} className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.units.to}
            </label>
            <button
              onClick={handleCopy}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.common.copied : t.common.copy}</span>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <input
              id={toValueInputId}
              type="text"
              readOnly
              value={formatLocalizedNumber(convertedResult, lang, 6)}
              className="w-full px-4 py-3 text-xl font-bold font-mono bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
            />
            <select
              aria-label={t.units.to}
              value={toUnitId}
              onChange={(e) => {
                playKeyClick('action', soundEnabled);
                setToUnitId(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {currentCategory.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {lang === 'bn' ? unit.nameBn : unit.nameEn} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formula & Equivalence Banner */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">
            {lang === 'bn' ? 'রূপান্তর সমীকরণ:' : 'Conversion Equation:'}
          </span>{' '}
          1 {lang === 'bn' ? fromUnit.nameBn : fromUnit.nameEn} ={' '}
          <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            {formatLocalizedNumber(toUnit.fromBase(fromUnit.toBase(1)), lang, 6)} {toUnit.symbol}
          </span>
        </div>
      </div>

      {/* Helpful regional reference cards */}
      {selectedCatId === 'mass' && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <span className="font-semibold text-amber-900 dark:text-amber-300 block">১ ভরি / তোলা</span>
            <span>= ১১.৬৬৪ গ্রাম (১৬ আনা)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <span className="font-semibold text-amber-900 dark:text-amber-300 block">১ আনা</span>
            <span>= ০.৭২৯ গ্রাম (৬ রতি)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <span className="font-semibold text-amber-900 dark:text-amber-300 block">১ মণ</span>
            <span>= ৪০ কিলোগ্রাম (কেজি)</span>
          </div>
        </div>
      )}

      {selectedCatId === 'area' && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300 block">১ শতক / ডেসিমেল</span>
            <span>= ৪৩৫.৬ বর্গফুট</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300 block">১ কাঠা</span>
            <span>= ৭২০ বর্গফুট (১.৬৫ শতক)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300 block">১ বিঘা</span>
            <span>= ২০ কাঠা (৩৩ শতক)</span>
          </div>
        </div>
      )}
    </div>
  );
};

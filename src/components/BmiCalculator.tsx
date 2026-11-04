import React, { useState, useId } from 'react';
import { Activity, Info, HeartPulse } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { formatLocalizedNumber, toBengaliNumber } from '../utils/bengali.ts';

interface BmiCalculatorProps {
  lang: Language;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const heightCmInputId = useId();
  const heightFeetInputId = useId();
  const heightInchesInputId = useId();
  const weightInputId = useId();

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(7);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [weightLbs, setWeightLbs] = useState<number>(150);

  // Compute BMI
  let effectiveHeightM = heightCm / 100;
  let effectiveWeightKg = weightKg;

  if (unitSystem === 'imperial') {
    const totalInches = heightFeet * 12 + heightInches;
    effectiveHeightM = totalInches * 0.0254;
    effectiveWeightKg = weightLbs * 0.453592;
  }

  let bmi = 0;
  if (effectiveHeightM > 0) {
    bmi = effectiveWeightKg / (effectiveHeightM * effectiveHeightM);
  }

  // Health Category
  let categoryKey: 'underweight' | 'normal' | 'overweight' | 'obese' = 'normal';
  let categoryColor = 'text-emerald-600 dark:text-emerald-400';
  let categoryBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40';

  if (bmi < 18.5) {
    categoryKey = 'underweight';
    categoryColor = 'text-sky-600 dark:text-sky-400';
    categoryBg = 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40';
  } else if (bmi <= 24.9) {
    categoryKey = 'normal';
    categoryColor = 'text-emerald-600 dark:text-emerald-400';
    categoryBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40';
  } else if (bmi <= 29.9) {
    categoryKey = 'overweight';
    categoryColor = 'text-amber-600 dark:text-amber-400';
    categoryBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40';
  } else {
    categoryKey = 'obese';
    categoryColor = 'text-rose-600 dark:text-rose-400';
    categoryBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40';
  }

  // Ideal weight range for height (BMI 18.5 - 24.9)
  const minIdealKg = 18.5 * (effectiveHeightM * effectiveHeightM);
  const maxIdealKg = 24.9 * (effectiveHeightM * effectiveHeightM);

  // Meter position calculation for gauge (range 15 to 35)
  const clampedBmi = Math.min(35, Math.max(15, bmi));
  const meterPercent = ((clampedBmi - 15) / 20) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.bmi.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.bmi.subtitle}
          </p>
        </div>

        {/* Unit toggle: Metric vs Imperial */}
        <div className="flex items-center gap-1 self-start sm:self-auto p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              unitSystem === 'metric'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'মেট্রিক (সেমি / কেজি)' : 'Metric (cm / kg)'}
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              unitSystem === 'imperial'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'ইউএস (ফুট / পাউন্ড)' : 'US (ft / lbs)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input Fields */}
        <div className="space-y-5">
          {/* Height Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.bmi.height}
            </label>
            {unitSystem === 'metric' ? (
              <div className="relative">
                <input
                  id={heightCmInputId}
                  type="number"
                  min="50"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-3 text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  {lang === 'bn' ? 'সেমি (cm)' : 'cm'}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    id={heightFeetInputId}
                    type="number"
                    min="1"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {t.bmi.feet}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id={heightInchesInputId}
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {t.bmi.inches}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div className="space-y-1.5">
            <label htmlFor={weightInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.bmi.weight}
            </label>
            <div className="relative">
              <input
                id={weightInputId}
                type="number"
                min="10"
                max="300"
                value={unitSystem === 'metric' ? weightKg : weightLbs}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  if (unitSystem === 'metric') setWeightKg(val);
                  else setWeightLbs(val);
                }}
                className="w-full px-4 py-3 text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                {unitSystem === 'metric' ? (lang === 'bn' ? 'কেজি (kg)' : 'kg') : (lang === 'bn' ? 'পাউন্ড (lbs)' : 'lbs')}
              </span>
            </div>
          </div>

          {/* Quick Guidance Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <HeartPulse className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                {t.bmi.healthyRange}:
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {formatLocalizedNumber(minIdealKg, lang, 1)} kg – {formatLocalizedNumber(maxIdealKg, lang, 1)} kg
              </span>{' '}
              {unitSystem === 'imperial' && (
                <span className="text-[11px] text-slate-400">
                  ({formatLocalizedNumber(minIdealKg * 2.20462, lang, 1)} – {formatLocalizedNumber(maxIdealKg * 2.20462, lang, 1)} lbs)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Results Card with Scale */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t.bmi.yourBmi}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 dark:text-white">
                {formatLocalizedNumber(bmi, lang, 1)}
              </span>
              <span className="text-xs font-mono text-slate-400">kg/m²</span>
            </div>

            {/* Health Category Badge */}
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${categoryBg} ${categoryColor}`}>
              <Activity className="w-3.5 h-3.5" />
              <span>{t.bmi[categoryKey]}</span>
            </div>
          </div>

          {/* Visual BMI Gauge Meter */}
          <div>
            <div className="relative w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-sky-400 h-full w-[25%]" title="Underweight (<18.5)"></div>
              <div className="bg-emerald-500 h-full w-[35%]" title="Normal (18.5 - 24.9)"></div>
              <div className="bg-amber-400 h-full w-[20%]" title="Overweight (25 - 29.9)"></div>
              <div className="bg-rose-500 h-full w-[20%]" title="Obese (≥30)"></div>
            </div>

            {/* Pointer Pin Indicator */}
            <div className="relative w-full h-4 mt-1">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                style={{ left: `${meterPercent}%` }}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-indigo-600 dark:border-b-indigo-400"></div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">▲</span>
              </div>
            </div>

            {/* Scale legend text */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>&lt;18.5</span>
              <span>18.5–24.9</span>
              <span>25–29.9</span>
              <span>30+</span>
            </div>
          </div>

          {/* Educational tips */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            {lang === 'bn' 
              ? 'বিএমআই বিশ্ব স্বাস্থ্য সংস্থা (WHO) অনুমোদিত সূচক, যা প্রাপ্তবয়স্ক নারী ও পুরুষ উভয়ের স্বাস্থ্য পরিমাপে ব্যবহৃত হয়।'
              : 'BMI is a standard health indicator recommended by the World Health Organization (WHO) for adults.'}
          </div>
        </div>
      </div>
    </div>
  );
};

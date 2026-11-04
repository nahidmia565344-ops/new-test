import React, { useState, useId } from 'react';
import { Language, CurrencySymbol } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { formatLocalizedNumber, toBengaliNumber } from '../utils/bengali.ts';

interface FinancialCalculatorProps {
  lang: Language;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const loanAmountInputId = useId();
  const interestRateInputId = useId();
  const tenureInputId = useId();

  const [principal, setPrincipal] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [currency, setCurrency] = useState<CurrencySymbol>('৳');

  const totalMonths = tenureType === 'years' ? tenureYears * 12 : tenureYears;
  const monthlyRate = interestRate / 12 / 100;

  // Monthly EMI formula
  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (principal > 0 && interestRate > 0 && totalMonths > 0) {
    if (monthlyRate === 0) {
      emi = principal / totalMonths;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    totalPayment = emi * totalMonths;
    totalInterest = totalPayment - principal;
  }

  const principalRatio = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Generate yearly amortization breakdown
  const yearlySchedule = [];
  let balance = principal;
  const numYears = Math.ceil(totalMonths / 12);
  for (let y = 1; y <= numYears; y++) {
    const monthsInYear = Math.min(12, totalMonths - (y - 1) * 12);
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let m = 0; m < monthsInYear; m++) {
      const monthInterest = balance * monthlyRate;
      const monthPrincipal = emi - monthInterest;
      yearlyInterest += monthInterest;
      yearlyPrincipal += monthPrincipal;
      balance = Math.max(0, balance - monthPrincipal);
    }

    yearlySchedule.push({
      year: y,
      yearlyPrincipal,
      yearlyInterest,
      balance
    });
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.finance.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.finance.subtitle}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input sliders & fields */}
        <div className="space-y-6">
          {/* Principal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <label htmlFor={loanAmountInputId}>{t.finance.loanAmount}</label>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                {currency} {formatLocalizedNumber(principal, lang, 0)}
              </span>
            </div>
            <input
              id={loanAmountInputId}
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              <span>{currency} {lang === 'bn' ? '১০,০০০' : '10,000'}</span>
              <span>{currency} {lang === 'bn' ? '১,০০,০০,০০০' : '10,000,000'}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <label htmlFor={interestRateInputId}>{t.finance.interestRate}</label>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                {formatLocalizedNumber(interestRate, lang, 2)}%
              </span>
            </div>
            <input
              id={interestRateInputId}
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              <span>১%</span>
              <span>২৫%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <label htmlFor={tenureInputId}>{t.finance.tenure}</label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                  {lang === 'bn' ? toBengaliNumber(tenureYears) : tenureYears}{' '}
                  {tenureType === 'years' ? t.finance.years : t.finance.months}
                </span>
                <div className="flex items-center text-xs bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setTenureType('years')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer ${
                      tenureType === 'years' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
                    }`}
                  >
                    {t.finance.years}
                  </button>
                  <button
                    onClick={() => setTenureType('months')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer ${
                      tenureType === 'months' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
                    }`}
                  >
                    {t.finance.months}
                  </button>
                </div>
              </div>
            </div>
            <input
              id={tenureInputId}
              type="range"
              min="1"
              max={tenureType === 'years' ? 30 : 360}
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculation Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-5">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t.finance.monthlyEmi}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                {currency} {formatLocalizedNumber(Math.round(emi), lang, 0)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/{t.finance.months}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.finance.totalInterest}</span>
              <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {currency} {formatLocalizedNumber(Math.round(totalInterest), lang, 0)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.finance.totalPayment}</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                {currency} {formatLocalizedNumber(Math.round(totalPayment), lang, 0)}
              </span>
            </div>
          </div>

          {/* Visual ratio bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                {t.finance.principal} ({formatLocalizedNumber(Math.round(principalRatio), lang, 0)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                {t.finance.interest} ({formatLocalizedNumber(Math.round(interestRatio), lang, 0)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${principalRatio}%` }}
              ></div>
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${interestRatio}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization table snippet */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {t.finance.schedulePreview}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="pb-2">{lang === 'bn' ? 'বছর' : 'Year'}</th>
                <th className="pb-2 text-right">{t.finance.principal}</th>
                <th className="pb-2 text-right">{t.finance.interest}</th>
                <th className="pb-2 text-right">{lang === 'bn' ? 'অবশিষ্ট আসল' : 'Balance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {yearlySchedule.slice(0, 5).map((row) => (
                <tr key={row.year} className="text-slate-700 dark:text-slate-300">
                  <td className="py-2 font-sans font-medium">
                    {lang === 'bn' ? `বছর ${toBengaliNumber(row.year)}` : `Year ${row.year}`}
                  </td>
                  <td className="py-2 text-right">{currency} {formatLocalizedNumber(Math.round(row.yearlyPrincipal), lang, 0)}</td>
                  <td className="py-2 text-right text-amber-600 dark:text-amber-400">{currency} {formatLocalizedNumber(Math.round(row.yearlyInterest), lang, 0)}</td>
                  <td className="py-2 text-right">{currency} {formatLocalizedNumber(Math.round(row.balance), lang, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlySchedule.length > 5 && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2 italic">
              {lang === 'bn' ? `(প্রথম ৫ বছরের কিস্তি প্রদর্শিত হচ্ছে)` : `(Showing first 5 years of loan schedule)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

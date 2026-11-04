import React, { useState, useId } from 'react';
import { Calendar, Cake, Clock } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { formatLocalizedNumber, toBengaliNumber } from '../utils/bengali.ts';

interface AgeDateCalculatorProps {
  lang: Language;
}

const BENGALI_DAYS = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AgeDateCalculator: React.FC<AgeDateCalculatorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const dobInputId = useId();
  const targetDateInputId = useId();

  // Default DOB to 25 years ago
  const today = new Date();
  const defaultDob = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];
  const todayString = today.toISOString().split('T')[0];

  const [dob, setDob] = useState<string>(defaultDob);
  const [targetDate, setTargetDate] = useState<string>(todayString);

  // Compute age
  const birth = new Date(dob);
  const target = new Date(targetDate);

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Get days in previous month
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Born day of week
  const bornDayIndex = birth.getDay();
  const bornDayName = lang === 'bn' ? BENGALI_DAYS[bornDayIndex] : ENGLISH_DAYS[bornDayIndex];

  // Total life metrics
  const diffTimeMs = Math.max(0, target.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTimeMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMonths = years * 12 + months;

  // Next Birthday countdown
  const currentYearBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  let nextBirthday = currentYearBirthday;
  if (currentYearBirthday.getTime() < target.getTime()) {
    nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }

  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  const nextBirthdayDayName = lang === 'bn' 
    ? BENGALI_DAYS[nextBirthday.getDay()] 
    : ENGLISH_DAYS[nextBirthday.getDay()];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.age.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.age.subtitle}
        </p>
      </div>

      {/* Date Input Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1.5">
          <label htmlFor={dobInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Cake className="w-4 h-4 text-pink-500" />
            <span>{t.age.dobLabel}</span>
          </label>
          <input
            id={dobInputId}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={targetDateInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{t.age.targetDateLabel}</span>
          </label>
          <input
            id={targetDateInputId}
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Primary Age Result Banner */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/60 dark:to-slate-900 p-6 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 mb-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          {t.age.exactAge}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-3 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'bn' ? toBengaliNumber(years) : years}
            </span>
            <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'bn' ? 'বছর' : 'Years'}
            </span>
          </div>
          <span className="text-2xl text-slate-400 dark:text-slate-600">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'bn' ? toBengaliNumber(months) : months}
            </span>
            <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'bn' ? 'মাস' : 'Months'}
            </span>
          </div>
          <span className="text-2xl text-slate-400 dark:text-slate-600">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'bn' ? toBengaliNumber(days) : days}
            </span>
            <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'bn' ? 'দিন' : 'Days'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300">
          <span>{t.age.bornOnDay}: </span>
          <strong className="font-semibold">{bornDayName}</strong>
        </div>
      </div>

      {/* Birthday Countdown & Life Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Next Birthday Card */}
        <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-400 rounded-xl">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.age.nextBirthday}</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
              {daysToNextBirthday === 0 ? (
                <span className="text-pink-600 dark:text-pink-400">
                  🎉 {lang === 'bn' ? 'আজ আপনার জন্মদিন!' : 'Today is your birthday!'}
                </span>
              ) : (
                <>
                  <span>{lang === 'bn' ? toBengaliNumber(daysToNextBirthday) : daysToNextBirthday}</span>{' '}
                  <span className="text-xs font-sans text-slate-500">{t.age.daysLeft}</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              ({nextBirthdayDayName})
            </span>
          </div>
        </div>

        {/* Life Timeline summary */}
        <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.age.totalDays}</span>
            <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {formatLocalizedNumber(totalDays, lang, 0)} {lang === 'bn' ? 'দিন' : 'days'}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              ≈ {formatLocalizedNumber(totalHours, lang, 0)} {lang === 'bn' ? 'ঘণ্টা' : 'hours'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400 block">{t.age.totalMonths}</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
            {formatLocalizedNumber(totalMonths, lang, 0)}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400 block">{t.age.totalWeeks}</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
            {formatLocalizedNumber(totalWeeks, lang, 0)}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400 block">{lang === 'bn' ? 'মোট মিনিট' : 'Total Minutes'}</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
            {formatLocalizedNumber(totalDays * 1440, lang, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

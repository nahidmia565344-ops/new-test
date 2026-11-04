import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Globe } from 'lucide-react';
import { CalculatorMode, Language } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';

interface NavbarProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  lang,
  onToggleLang,
  isDark,
  onToggleDark,
  soundEnabled,
  onToggleSound
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onSelectMode('standard')} 
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                  {lang === 'bn' ? 'হিসাব' : 'HISAB'}
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                  {lang === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectMode('standard')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                currentMode === 'standard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              {t.modes.standard}
            </button>
            <button
              onClick={() => onSelectMode('scientific')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                currentMode === 'scientific' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              {t.modes.scientific}
            </button>
            <button
              onClick={() => onSelectMode('unit_converter')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                currentMode === 'unit_converter' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              {t.modes.unit_converter}
            </button>
            <button
              onClick={() => onSelectMode('financial_emi')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                currentMode === 'financial_emi' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              {t.modes.financial_emi}
            </button>
            <button
              onClick={() => onSelectMode('age_date')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                currentMode === 'age_date' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              {t.modes.age_date}
            </button>
          </nav>

          {/* Zone 3: Primary utility actions (Language, Sound, Theme) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.common.toggleLang}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                soundEnabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={soundEnabled ? t.common.soundOn : t.common.soundOff}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
              title={isDark ? t.common.lightTheme : t.common.darkTheme}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

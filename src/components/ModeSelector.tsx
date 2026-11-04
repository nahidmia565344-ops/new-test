import React from 'react';
import { 
  Calculator, 
  FlaskConical, 
  ArrowLeftRight, 
  BadgePercent, 
  CalendarDays, 
  ReceiptText, 
  Activity 
} from 'lucide-react';
import { CalculatorMode, Language } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';

interface ModeSelectorProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  lang: Language;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  const modes: { id: CalculatorMode; label: string; icon: React.ReactNode }[] = [
    { id: 'standard', label: t.modes.standard, icon: <Calculator className="w-4 h-4" /> },
    { id: 'scientific', label: t.modes.scientific, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'unit_converter', label: t.modes.unit_converter, icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'financial_emi', label: t.modes.financial_emi, icon: <BadgePercent className="w-4 h-4" /> },
    { id: 'age_date', label: t.modes.age_date, icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'tip_split', label: t.modes.tip_split, icon: <ReceiptText className="w-4 h-4" /> },
    { id: 'bmi_health', label: t.modes.bmi_health, icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-w-max mx-auto shadow-xs">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}>
                {mode.icon}
              </span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

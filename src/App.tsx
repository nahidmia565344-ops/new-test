import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ModeSelector } from './components/ModeSelector.tsx';
import { StandardCalculator } from './components/StandardCalculator.tsx';
import { ScientificCalculator } from './components/ScientificCalculator.tsx';
import { UnitConverter } from './components/UnitConverter.tsx';
import { FinancialCalculator } from './components/FinancialCalculator.tsx';
import { AgeDateCalculator } from './components/AgeDateCalculator.tsx';
import { TipSplitCalculator } from './components/TipSplitCalculator.tsx';
import { BmiCalculator } from './components/BmiCalculator.tsx';
import { HistoryPanel } from './components/HistoryPanel.tsx';
import { CalculatorMode, Language, CalculationHistoryItem } from './types.ts';
import { History } from 'lucide-react';

export default function App() {
  // Preferences with localStorage persistence
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('hisab_lang') as Language) || 'bn';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('hisab_theme');
    return saved ? saved === 'dark' : true;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('hisab_sound');
    return saved ? saved === 'true' : true;
  });

  const [currentMode, setCurrentMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('hisab_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedHistoryValue, setSelectedHistoryValue] = useState<string | undefined>(undefined);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState<boolean>(false);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hisab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hisab_theme', 'light');
    }
  }, [isDark]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('hisab_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Persist sound
  useEffect(() => {
    localStorage.setItem('hisab_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('hisab_history', JSON.stringify(history.slice(0, 50)));
    } catch {
      // Ignore quota errors
    }
  }, [history]);

  // Handlers
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleToggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleAddHistory = (item: CalculationHistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, 50));
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('hisab_history');
    } catch {
      // Ignore
    }
  };

  const handleSelectHistoryItem = (item: CalculationHistoryItem) => {
    setSelectedHistoryValue(item.result);
    // Switch to appropriate calculator if not already
    if (currentMode !== 'standard' && currentMode !== 'scientific') {
      setCurrentMode(item.mode);
    }
    setIsMobileHistoryOpen(false);
  };

  const showSideHistory = currentMode === 'standard' || currentMode === 'scientific';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        lang={lang}
        onToggleLang={handleToggleLang}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Mode Selector Strip */}
        <ModeSelector
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          lang={lang}
        />

        {/* Dynamic Calculator Workspace */}
        <div className="flex-1 flex flex-col justify-center">
          {showSideHistory ? (
            /* Desktop split view: Calculator in center-left, Live History on right */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6 items-start max-w-5xl mx-auto w-full">
              {/* Active Calculator */}
              <div className="w-full flex justify-center">
                {currentMode === 'standard' && (
                  <StandardCalculator
                    lang={lang}
                    soundEnabled={soundEnabled}
                    onAddHistory={handleAddHistory}
                    initialValue={selectedHistoryValue}
                  />
                )}
                {currentMode === 'scientific' && (
                  <ScientificCalculator
                    lang={lang}
                    soundEnabled={soundEnabled}
                    onAddHistory={handleAddHistory}
                    initialValue={selectedHistoryValue}
                  />
                )}
              </div>

              {/* Desktop History Sidebar */}
              <div className="hidden lg:block w-full sticky top-24">
                <HistoryPanel
                  history={history}
                  onClearHistory={handleClearHistory}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  lang={lang}
                />
              </div>
            </div>
          ) : (
            /* Dedicated full-width workspace for specialized tools */
            <div className="w-full">
              {currentMode === 'unit_converter' && (
                <UnitConverter lang={lang} soundEnabled={soundEnabled} />
              )}
              {currentMode === 'financial_emi' && (
                <FinancialCalculator lang={lang} />
              )}
              {currentMode === 'age_date' && (
                <AgeDateCalculator lang={lang} />
              )}
              {currentMode === 'tip_split' && (
                <TipSplitCalculator lang={lang} soundEnabled={soundEnabled} />
              )}
              {currentMode === 'bmi_health' && (
                <BmiCalculator lang={lang} />
              )}
            </div>
          )}
        </div>

        {/* Keyboard and Quick Tips Help Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'bn' ? 'কীবোর্ড শর্টকাট:' : 'Keyboard Shortcuts:'}
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200">0-9</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200">+ - * /</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200">Enter =</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200">Esc (Clear)</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {lang === 'bn' 
                ? 'বাংলা ও ইংরেজি উভয় ভাষায় সঠিক হিসাব সংরক্ষণ' 
                : 'Accurate bilingual calculations with persistent history'}
            </span>
          </div>
        </div>
      </main>

      {/* Floating History button for Mobile */}
      <div className="lg:hidden fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setIsMobileHistoryOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95 transition-all"
        >
          <History className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হিসাব হিস্টোরি' : 'History'}</span>
          {history.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-indigo-700 text-[10px] font-bold flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile History Drawer / Modal */}
      {isMobileHistoryOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <HistoryPanel
              history={history}
              onClearHistory={handleClearHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
              lang={lang}
              onClose={() => setIsMobileHistoryOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

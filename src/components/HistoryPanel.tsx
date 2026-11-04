import React, { useState } from 'react';
import { History, Trash2, Copy, Check, Download, ArrowUpRight, X } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../types.ts';
import { TRANSLATIONS } from '../utils/translations.ts';
import { toBengaliNumber } from '../utils/bengali.ts';

interface HistoryPanelProps {
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
  lang: Language;
  onClose?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onSelectHistoryItem,
  lang,
  onClose
}) => {
  const t = TRANSLATIONS[lang];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: CalculationHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const content = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.expression} = ${h.result}`
      )
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hisab-calculations-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.common.history}
          </h3>
          <span className="text-xs font-mono text-slate-400">
            ({lang === 'bn' ? toBengaliNumber(history.length) : history.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={lang === 'bn' ? 'টেক্সট ফাইল হিসেবে ডাউনলোড করুন' : 'Export to text'}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title={t.common.clearHistory}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* History Items list */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 max-h-[500px]">
        {history.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 px-4">
            <History className="w-8 h-8 stroke-[1.5] mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs">{t.common.noHistory}</p>
          </div>
        ) : (
          history.map((item) => {
            const isCopied = copiedId === item.id;
            const displayExpr = lang === 'bn' ? toBengaliNumber(item.expression) : item.expression;
            const displayRes = lang === 'bn' ? toBengaliNumber(item.result) : item.result;
            const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="group relative p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono mb-1">
                  <span>{timeStr}</span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopy(item, e)}
                      className="p-1 rounded hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      title={isCopied ? t.common.copied : t.common.copy}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  {displayExpr}
                </div>

                <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  = {displayRes}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

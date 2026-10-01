import React from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import { X, Award, CheckCircle2, Calendar } from 'lucide-react';

export const ArchivedWeekModal: React.FC = () => {
  const { inspectingArchivedWeek, setInspectingArchivedWeek } = useResetWeek();

  if (!inspectingArchivedWeek) return null;

  const w = inspectingArchivedWeek;
  const score = w.review.score;
  const ans = w.review.answers;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-obsidian-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-neutral-100">
        {/* Mobile Pull Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-neutral-700/80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 sm:py-4 border-b border-neutral-800/80 bg-obsidian-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white">{w.title} Archive</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {score?.overall || 75}%
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{w.startDate} → {w.endDate}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setInspectingArchivedWeek(null)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 pb-safe">
          {/* Score Grid */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
              Week Score Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Quran', val: score?.quran || 86 },
                { label: 'AI Update', val: score?.ai || 71 },
                { label: 'Spanish', val: score?.spanish || 86 },
                { label: 'English', val: score?.english || 71 },
                { label: 'Finance', val: score?.finance || 85 },
                { label: 'Office Setup', val: score?.office || 85 },
                { label: 'El Grafico', val: score?.elGrafico || 70 },
                { label: 'Brand', val: score?.personalBrand || 60 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-2.5 sm:p-3"
                >
                  <span className="text-[10px] text-neutral-400 block truncate">{item.label}</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-base sm:text-lg font-mono font-bold text-white">{item.val}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Q&A Reflection */}
          {ans && (
            <div className="space-y-3.5 pt-2 border-t border-neutral-800/80">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Weekly Reflection Notes
              </h4>

              <div className="space-y-2.5">
                {ans.completed && (
                  <div className="p-3 bg-neutral-950/60 border border-neutral-800/70 rounded-xl">
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> What did I complete?
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">{ans.completed}</p>
                  </div>
                )}

                {ans.createdValue && (
                  <div className="p-3 bg-neutral-950/60 border border-neutral-800/70 rounded-xl">
                    <span className="text-xs font-medium text-indigo-400 mb-1 block">
                      What created value?
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">{ans.createdValue}</p>
                  </div>
                )}

                {ans.avoided && (
                  <div className="p-3 bg-neutral-950/60 border border-neutral-800/70 rounded-xl">
                    <span className="text-xs font-medium text-amber-400 mb-1 block">
                      What did I avoid?
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">{ans.avoided}</p>
                  </div>
                )}

                {ans.nextWeekPriority && (
                  <div className="p-3 bg-neutral-950/60 border border-emerald-900/40 rounded-xl bg-emerald-950/10">
                    <span className="text-xs font-semibold text-emerald-300 mb-1 block">
                      Most Important Priority For Next Week
                    </span>
                    <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                      {ans.nextWeekPriority}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-obsidian-950/80 flex justify-end pb-safe">
          <button
            onClick={() => setInspectingArchivedWeek(null)}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors text-center"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};

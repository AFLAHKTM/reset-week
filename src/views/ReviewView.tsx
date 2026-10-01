import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import {
  Award,
  RotateCw,
  History,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const ReviewView: React.FC = () => {
  const {
    currentWeek,
    history,
    calculatedWeekScore,
    updateReviewAnswers,
    startNewResetWeek,
    setInspectingArchivedWeek,
  } = useResetWeek();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const answers = currentWeek.review?.answers || {
    completed: '',
    avoided: '',
    wastedTime: '',
    createdValue: '',
    stop: '',
    continueAction: '',
    nextWeekPriority: '',
  };

  const questions: {
    key: keyof typeof answers;
    num: number;
    q: string;
    placeholder: string;
  }[] = [
    {
      key: 'completed',
      num: 1,
      q: 'What did I complete?',
      placeholder: 'Key outcomes delivered, non-negotiables maintained...',
    },
    {
      key: 'avoided',
      num: 2,
      q: 'What did I avoid?',
      placeholder: 'Tasks or decisions delayed due to friction or hesitation...',
    },
    {
      key: 'wastedTime',
      num: 3,
      q: 'What wasted my time?',
      placeholder: 'Unnecessary browsing, minor optimizations, distractions...',
    },
    {
      key: 'createdValue',
      num: 4,
      q: 'What created value?',
      placeholder: 'Meaningful work that moved the needle...',
    },
    {
      key: 'stop',
      num: 5,
      q: 'What should I stop?',
      placeholder: 'Habits or practices that drained energy without output...',
    },
    {
      key: 'continueAction',
      num: 6,
      q: 'What should I continue?',
      placeholder: 'Routines that felt seamless and built momentum...',
    },
    {
      key: 'nextWeekPriority',
      num: 7,
      q: 'Most important priority for next week?',
      placeholder: 'The single non-negotiable anchor for next cycle...',
    },
  ];

  const scoreItems = [
    { label: 'Quran', value: calculatedWeekScore.quran },
    { label: 'AI', value: calculatedWeekScore.ai },
    { label: 'Spanish', value: calculatedWeekScore.spanish },
    { label: 'English', value: calculatedWeekScore.english },
    { label: 'Finance', value: calculatedWeekScore.finance },
    { label: 'Office', value: calculatedWeekScore.office },
    { label: 'El Grafico', value: calculatedWeekScore.elGrafico },
    { label: 'Brand', value: calculatedWeekScore.personalBrand },
    { label: 'General', value: calculatedWeekScore.general ?? 0 },
    { label: 'Aurad', value: calculatedWeekScore.aurad ?? 0 },
  ];

  const handleConfirmReset = () => {
    startNewResetWeek();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Thursday / Friday Ritual
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            WEEKLY REVIEW & RESET
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            Audit execution, calibrate direction, and renew the cycle.
          </p>
        </div>

        <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-indigo-400">
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* 9. THE 7 WEEKLY REVIEW QUESTIONS */}
      <section className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-elevated space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-base font-bold text-white tracking-tight">
              THE 7 REFLECTION QUESTIONS
            </h3>
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
            Self-Awareness
          </span>
        </div>

        <div className="space-y-3.5">
          {questions.map((item) => (
            <div key={item.key} className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <span className="font-mono text-emerald-400 font-bold">{item.num}.</span>
                <span>{item.q}</span>
              </label>
              <textarea
                rows={2}
                value={answers[item.key] || ''}
                onChange={(e) => updateReviewAnswers({ [item.key]: e.target.value })}
                placeholder={item.placeholder}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none transition-colors"
              />
            </div>
          ))}
        </div>
      </section>

      {/* GENERATED WEEK SCORE */}
      <section className="bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-elevated space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div>
            <h3 className="text-xs sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>WEEK SCORE</span>
              <span className="text-[10px] sm:text-xs font-mono font-normal text-neutral-400">
                (Depth)
              </span>
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 bg-neutral-950 px-2.5 py-1 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-mono">Average:</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white">
              {calculatedWeekScore.overall}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scoreItems.map((item) => (
            <div
              key={item.label}
              className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-2.5 sm:p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="text-[11px] truncate">{item.label}</span>
                <span className="font-mono font-bold text-white text-xs sm:text-sm">{item.value}%</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FRIDAY RESET BUTTON */}
      <section className="p-4 sm:p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 space-y-3.5">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-emerald-300">FRIDAY RESET</h3>
            <p className="text-xs text-neutral-300 mt-0.5">
              Archive your scores and reflections, and open a clean Friday → Friday cycle.
            </p>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-elevated mt-1"
          >
            <RotateCw className="w-4 h-4 stroke-[2.5]" />
            <span>+ START NEW RESET WEEK</span>
          </button>
        </div>

        {/* Confirmation prompt */}
        {isResetConfirmOpen && (
          <div className="p-3.5 bg-obsidian-950 border border-neutral-800 rounded-xl space-y-2.5 animate-in fade-in duration-150">
            <div className="text-xs text-neutral-200">
              Ready to archive <span className="font-bold text-white">{currentWeek.title}</span> and launch <span className="font-bold text-emerald-400">Week {String(currentWeek.weekNumber + 1).padStart(2, '0')}</span>?
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              >
                Yes, Start New Week
              </button>
            </div>
          </div>
        )}
      </section>

      {/* HISTORY SECTION */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">HISTORY</h3>
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
            {history.length} Previous Cycles
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-5 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs">
            No previous weeks archived yet.
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((hw) => {
              const score = hw.review?.score?.overall ?? 75;
              return (
                <div
                  key={hw.id}
                  onClick={() => setInspectingArchivedWeek(hw)}
                  className="flex items-center justify-between p-3.5 bg-obsidian-900 border border-neutral-800/80 active:bg-neutral-800/60 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {hw.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-neutral-400 font-mono">
                      ({hw.startDate.slice(5)} → {hw.endDate.slice(5)})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                      {score}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

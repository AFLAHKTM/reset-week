import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { WeeklyOutcomes } from '../types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  RotateCcw,
} from 'lucide-react';

export const WeekView: React.FC = () => {
  const {
    currentWeek,
    selectedDate,
    setSelectedDate,
    dayKeys,
    outcomesProgress,
    toggleOutcomeTask,
    resetDailyOutcomes,
    getOutcomeTaskStatus,
    addOutcomeTask,
    toggleMindResetItem,
    updateMindResetField,
  } = useResetWeek();

  // State for new task inputs
  const [addingTo, setAddingTo] = useState<keyof WeeklyOutcomes | null>(null);
  const [newText, setNewText] = useState('');

  const outcomesList: {
    key: keyof WeeklyOutcomes;
    title: string;
    description: string;
    color: string;
    badgeColor?: string;
    progress: number;
    isDaily?: boolean;
  }[] = [
    {
      key: 'officeAndElGrafico',
      title: '🏢 OFFICE + EL GRAFICO PROTOTYPE',
      description: 'Physical workspace excellence & business prototype architecture',
      color: 'bg-emerald-500',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      progress: outcomesProgress.office,
      isDaily: true,
    },
    {
      key: 'personalBrand',
      title: '👤 PERSONAL BRAND — JUST START',
      description: 'Overcome friction, establish positioning, publish authentic content',
      color: 'bg-indigo-500',
      progress: outcomesProgress.brand,
      isDaily: false,
    },
    {
      key: 'personalReset',
      title: '🧠 PERSONAL RESET',
      description: 'Discipline baseline, spiritual grounding & cognitive clarity',
      color: 'bg-amber-500',
      progress: outcomesProgress.reset,
      isDaily: false,
    },
    {
      key: 'general',
      title: '🛒 GENERAL & COMMUNITY',
      description: 'Personal errands, shopping, home visits, meeting key persons & programs',
      color: 'bg-sky-500',
      progress: outcomesProgress.general,
      isDaily: false,
    },
    {
      key: 'aurad',
      title: '📿 AURAD & SPIRITUAL RECITATIONS',
      description: 'Litanies & Surahs: Ratib Al-Haddad, Surah Yaseen, Surat Al-Fath & daily adhkar',
      color: 'bg-purple-500',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      progress: outcomesProgress.aurad,
      isDaily: true,
    },
  ];

  const handleAddTaskSubmit = (category: keyof WeeklyOutcomes, e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addOutcomeTask(category, newText.trim());
    setNewText('');
    setAddingTo(null);
  };

  const mindReset = currentWeek.mindReset;
  const completedMindResetItems = mindReset.checklist.filter((i) => i.completed).length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Execution Focus
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            THIS WEEK'S OUTCOMES
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            {currentWeek.title} ({currentWeek.startDate.slice(5)} → {currentWeek.endDate.slice(5)})
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] sm:text-xs text-neutral-400 font-mono block">Overall</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-white">
            {outcomesProgress.overall}%
          </span>
        </div>
      </div>

      {/* Daily Routine Date Selector */}
      <div className="bg-obsidian-900 border border-neutral-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Active Routine Day:</span>
              <span className="text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {currentWeek.days[selectedDate]?.dayName || selectedDate} ({selectedDate.slice(5)})
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Office & Aurad routines reset daily. Tap a day to switch:
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {dayKeys.map((dKey) => {
            const day = currentWeek.days[dKey];
            const isSelected = dKey === selectedDate;
            const shortName = day?.dayName?.slice(0, 3) || dKey.slice(8);
            return (
              <button
                key={dKey}
                onClick={() => setSelectedDate(dKey)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-medium transition-all flex items-center gap-1 whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span>{shortName}</span>
                <span className="text-[9px] opacity-75">{dKey.slice(8)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="space-y-4 sm:space-y-6">
        {outcomesList.map((item) => {
          const outcome = currentWeek.outcomes?.[item.key] || {
            title: item.title,
            description: item.description,
            tasks: [],
          };
          const tasks = outcome.tasks || [];
          const completedCount = tasks.filter((t) => {
            if (item.isDaily) {
              return getOutcomeTaskStatus(item.key, t.id, selectedDate).completed;
            }
            return t.completed;
          }).length;

          return (
            <div
              key={item.key}
              className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-elevated space-y-3.5"
            >
              {/* Outcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {outcome.title}
                    </h3>
                    {item.isDaily && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border flex items-center gap-1 ${item.badgeColor || 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'}`}>
                        <RotateCcw className="w-2.5 h-2.5" />
                        RESETS DAILY
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                    {outcome.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  {item.isDaily && (
                    <button
                      type="button"
                      onClick={() => resetDailyOutcomes(item.key as 'officeAndElGrafico' | 'aurad', selectedDate)}
                      className="px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-medium bg-neutral-950 border border-neutral-700/80 hover:border-emerald-500/60 hover:text-emerald-400 text-neutral-300 transition-colors flex items-center gap-1 active:scale-95"
                      title={`Reset all daily checks for ${currentWeek.days[selectedDate]?.dayName || selectedDate}`}
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-400" />
                      <span>Reset Daily</span>
                    </button>
                  )}
                  <span className="text-[11px] font-mono text-neutral-400">
                    {completedCount} / {tasks.length} Done
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-white">
                    {item.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800/80">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-300`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              {/* Task Checklist */}
              <div className="space-y-1.5 pt-1">
                {tasks.map((task) => {
                  const status = item.isDaily
                    ? getOutcomeTaskStatus(item.key, task.id, selectedDate)
                    : { completed: task.completed, completedAt: task.completedAt };
                  const isDone = status.completed;
                  const doneAt = status.completedAt;

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleOutcomeTask(item.key, task.id, selectedDate)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                        isDone
                          ? 'bg-neutral-950/40 border-neutral-800/40 text-neutral-400'
                          : 'bg-obsidian-950/60 border-neutral-800/70 hover:border-neutral-700 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 sm:space-x-3 flex-1 min-w-0">
                        <button
                          type="button"
                          aria-label={`Toggle ${task.text}`}
                          className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isDone
                              ? 'bg-emerald-600 border border-emerald-500 text-white'
                              : 'border-2 border-neutral-600 text-transparent'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-transparent" />
                          )}
                        </button>
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            isDone ? 'line-through text-neutral-400' : 'text-neutral-100'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      {doneAt && (
                        <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-0.5 flex-shrink-0 ml-1.5">
                          <Clock className="w-2.5 h-2.5 text-neutral-400" />
                          {doneAt}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Task */}
              {addingTo === item.key ? (
                <form
                  onSubmit={(e) => handleAddTaskSubmit(item.key, e)}
                  className="flex items-center space-x-2 pt-1.5"
                >
                  <input
                    type="text"
                    placeholder="Describe custom task..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingTo(null);
                      setNewText('');
                    }}
                    className="px-2.5 py-2 text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setAddingTo(item.key)}
                  className="flex items-center space-x-1.5 text-xs font-mono text-neutral-400 hover:text-neutral-200 pt-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add milestone task</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 🌿 ONE-DAY TRIP / MIND RESET */}
      <section className="bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-elevated space-y-5">
        <div className="flex items-start justify-between border-b border-neutral-800/80 pb-3 sm:pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 text-base sm:text-lg">🌿</span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">MIND RESET</h3>
            </div>
            <p className="italic font-serif text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 mt-1 sm:mt-2 max-w-xl">
              “Step away from routine, clear the mind, and return with a sharper direction.”
            </p>
          </div>
          <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 flex-shrink-0 ml-2">
            {completedMindResetItems}/6 Done
          </span>
        </div>

        {/* Mind Reset 6-Item Checklist */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
            Mind Reset Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mindReset.checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleMindResetItem(item.id)}
                className={`flex items-center space-x-2.5 p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                  item.completed
                    ? 'bg-neutral-950/40 border-neutral-800/40 text-neutral-400'
                    : 'bg-obsidian-950/60 border-neutral-800/70 hover:border-neutral-700 text-neutral-200'
                }`}
              >
                <button
                  type="button"
                  aria-label={`Toggle ${item.text}`}
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                    item.completed
                      ? 'bg-emerald-600 border border-emerald-500 text-white'
                      : 'border-2 border-neutral-600 text-transparent'
                  }`}
                >
                  {item.completed && <CheckCircle2 className="w-3 h-3" />}
                </button>
                <span className={`text-xs font-medium ${item.completed ? 'line-through text-neutral-400' : 'text-neutral-100'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Deep Reflection Fields */}
        <div className="space-y-3.5 pt-2 border-t border-neutral-800/80">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Deep Reset Reflections
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                What am I leaving behind?
              </label>
              <textarea
                rows={2}
                value={mindReset.leavingBehind}
                onChange={(e) => updateMindResetField('leavingBehind', e.target.value)}
                placeholder="Old habits, mental clutter, friction, unresolved hesitations..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                What do I want to restart?
              </label>
              <textarea
                rows={2}
                value={mindReset.wantToRestart}
                onChange={(e) => updateMindResetField('wantToRestart', e.target.value)}
                placeholder="High-leverage habits, deep work sprints, proactive outreach..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                What should I stop doing?
              </label>
              <textarea
                rows={2}
                value={mindReset.stopDoing}
                onChange={(e) => updateMindResetField('stopDoing', e.target.value)}
                placeholder="Distractions, unproductive tabs, reactive checking..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                What matters most now?
              </label>
              <textarea
                rows={2}
                value={mindReset.mattersMostNow}
                onChange={(e) => updateMindResetField('mattersMostNow', e.target.value)}
                placeholder="The single essential focus that will make everything else easier..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { WeeklyOutcomes } from '../types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock,
} from 'lucide-react';

export const WeekView: React.FC = () => {
  const {
    currentWeek,
    outcomesProgress,
    toggleOutcomeTask,
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
    progress: number;
  }[] = [
    {
      key: 'officeAndElGrafico',
      title: '🏢 OFFICE + EL GRAFICO PROTOTYPE',
      description: 'Physical workspace excellence & business prototype architecture',
      color: 'bg-emerald-500',
      progress: outcomesProgress.office,
    },
    {
      key: 'personalBrand',
      title: '👤 PERSONAL BRAND — JUST START',
      description: 'Overcome friction, establish positioning, publish authentic content',
      color: 'bg-indigo-500',
      progress: outcomesProgress.brand,
    },
    {
      key: 'personalReset',
      title: '🧠 PERSONAL RESET',
      description: 'Discipline baseline, spiritual grounding & cognitive clarity',
      color: 'bg-amber-500',
      progress: outcomesProgress.reset,
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
            THIS WEEK'S 3 OUTCOMES
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

      {/* 3 Outcome Cards */}
      <div className="space-y-4 sm:space-y-6">
        {outcomesList.map((item) => {
          const outcome = currentWeek.outcomes[item.key];
          const completedCount = outcome.tasks.filter((t) => t.completed).length;

          return (
            <div
              key={item.key}
              className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-elevated space-y-3.5"
            >
              {/* Outcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-neutral-800/80 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                    {outcome.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                    {outcome.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {completedCount} / {outcome.tasks.length} Done
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
                {outcome.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleOutcomeTask(item.key, task.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                      task.completed
                        ? 'bg-neutral-950/40 border-neutral-800/40 text-neutral-400'
                        : 'bg-obsidian-950/60 border-neutral-800/70 hover:border-neutral-700 text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 sm:space-x-3 flex-1 min-w-0">
                      <button
                        type="button"
                        aria-label={`Toggle ${task.text}`}
                        className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-emerald-600 border border-emerald-500 text-white'
                            : 'border-2 border-neutral-600 text-transparent'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-transparent" />
                        )}
                      </button>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          task.completed ? 'line-through text-neutral-400' : 'text-neutral-100'
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>

                    {task.completedAt && (
                      <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-0.5 flex-shrink-0 ml-1.5">
                        <Clock className="w-2.5 h-2.5 text-neutral-400" />
                        {task.completedAt}
                      </span>
                    )}
                  </div>
                ))}
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

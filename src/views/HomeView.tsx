import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { HabitKey, RoutineStatus } from '../types';
import {
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { parseISODate } from '../utils/dateUtils';

export const HomeView: React.FC = () => {
  const {
    currentDayData,
    selectedDate,
    todayDate,
    dailyCompletionPercentage,
    isDailyCoreComplete,
    currentStreak,
    sleepConsistencyPercentage,
    outcomesProgress,
    nowAction,
    toggleHabit,
    updateHabitNotes,
    updateRoutineStatus,
    setActiveTab,
  } = useResetWeek();

  // State to track which habit has its notes expanded
  const [expandedNotes, setExpandedNotes] = useState<Record<HabitKey, boolean>>({
    quran: false,
    ai: false,
    spanish: false,
    english: false,
    finance: false,
  });

  const habitsList: {
    key: HabitKey;
    icon: string;
    label: string;
    sublabel: string;
    targetTab?: 'home' | 'week' | 'learn' | 'finance' | 'review';
  }[] = [
    { key: 'quran', icon: '📖', label: '1 Juz Quran', sublabel: 'Daily recitation & reflection' },
    { key: 'ai', icon: '🤖', label: 'AI Update', sublabel: 'Learn & test one breakthrough tool', targetTab: 'learn' },
    { key: 'spanish', icon: '🇪🇸', label: 'Spanish', sublabel: '15 min language acquisition', targetTab: 'learn' },
    { key: 'english', icon: '🇬🇧', label: 'English Article', sublabel: 'Read 1 article & note vocab', targetTab: 'learn' },
    { key: 'finance', icon: '💰', label: 'Transaction Check', sublabel: 'Money In, Out & Balances', targetTab: 'finance' },
  ];

  const parsedDate = parseISODate(selectedDate);
  const formattedDay = parsedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const routineItems: {
    id: 'tahajjud' | 'wakeUp' | 'sleep';
    time: string;
    title: string;
    icon: string;
  }[] = [
    { id: 'tahajjud', time: '03:30 AM', title: 'Tahajjud', icon: '🌙' },
    { id: 'wakeUp', time: '05:30 AM', title: 'Wake Up', icon: '☀️' },
    { id: 'sleep', time: '11:00 PM', title: 'Sleep', icon: '😴' },
  ];

  const toggleExpand = (k: HabitKey) => {
    setExpandedNotes((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* 1. NOW CARD — What should I do now? */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-b from-obsidian-900 to-obsidian-950 p-4 sm:p-5 shadow-elevated">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              NOW · Next Action
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-neutral-400 font-mono">Priority #1</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
            {nowAction.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light">
            {nowAction.subtitle}
          </p>
        </div>

        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-neutral-800/80">
          <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono">
            {isDailyCoreComplete ? 'Daily Core Fulfilled ✓' : `${5 - Math.round((dailyCompletionPercentage / 100) * 5)} habits remaining`}
          </span>

          <button
            onClick={() => {
              if (nowAction.targetTab && nowAction.targetTab !== 'home') {
                setActiveTab(nowAction.targetTab);
              } else if (nowAction.type === 'habit') {
                const uncompletedKey = habitsList.find((h) => !currentDayData.habits[h.key]?.completed)?.key;
                if (uncompletedKey) {
                  toggleHabit(uncompletedKey);
                }
              }
            }}
            className="flex items-center justify-center space-x-1.5 w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-100 text-neutral-950 hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            <span>{nowAction.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </section>

      {/* 2. TODAY METRICS CARD (2x2 on Mobile) */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {/* Date & Day of Week */}
        <div className="bg-obsidian-900 border border-neutral-800/80 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            {selectedDate === todayDate ? 'Today' : 'Selected'}
          </span>
          <div className="mt-1.5">
            <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{formattedDay}</div>
            <div className="text-[10px] sm:text-xs font-mono text-emerald-400 mt-0.5">
              Day {currentDayData.dayIndex} of 7
            </div>
          </div>
        </div>

        {/* Completion % */}
        <div className="bg-obsidian-900 border border-neutral-800/80 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Daily Execution
          </span>
          <div className="mt-1.5">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                {dailyCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${dailyCompletionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-obsidian-900 border border-neutral-800/80 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Streak</span>
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500/20" />
          </span>
          <div className="mt-1.5">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                {currentStreak}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-mono">days</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5 truncate">Core discipline</div>
          </div>
        </div>

        {/* Weekly Sleep Consistency */}
        <div className="bg-obsidian-900 border border-neutral-800/80 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Sleep Baseline
          </span>
          <div className="mt-1.5">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">
                {sleepConsistencyPercentage}%
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5 truncate">Tahajjud & Rest</div>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S NON-NEGOTIABLES */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              TODAY'S NON-NEGOTIABLES
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400">5 daily anchors. Zero compromise.</p>
          </div>
          <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
            {Object.values(currentDayData.habits || {}).filter((h) => h.completed).length}/5 Done
          </span>
        </div>

        {/* All 5 Complete Banner */}
        {isDailyCoreComplete && (
          <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-emerald-300">Daily Core Complete ✓</div>
                <div className="text-[10px] sm:text-xs text-emerald-400/80">
                  All 5 non-negotiables locked in for today.
                </div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </div>
        )}

        <div className="space-y-2">
          {habitsList.map((item) => {
            const habit = currentDayData.habits?.[item.key] || {
              id: item.key,
              label: item.label,
              sublabel: item.sublabel,
              completed: false,
              notes: '',
            };
            const isExpanded = expandedNotes[item.key];

            return (
              <div
                key={item.key}
                className={`border rounded-xl transition-all ${
                  habit.completed
                    ? 'bg-neutral-950/40 border-neutral-800/60 opacity-90'
                    : 'bg-obsidian-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="p-3 sm:p-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleHabit(item.key)}
                      className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                        habit.completed
                          ? 'bg-emerald-600 border border-emerald-500 text-white'
                          : 'border-2 border-neutral-600 hover:border-neutral-400 text-transparent'
                      }`}
                      aria-label={`Toggle ${item.label}`}
                    >
                      {habit.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4 text-transparent" />
                      )}
                    </button>

                    {/* Text */}
                    <div
                      className="cursor-pointer flex-1 min-w-0"
                      onClick={() => toggleHabit(item.key)}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm sm:text-base">{item.icon}</span>
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            habit.completed ? 'line-through text-neutral-400' : 'text-neutral-100'
                          }`}
                        >
                          {habit.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate pl-5">
                        {habit.sublabel}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 ml-1.5">
                    {habit.completedAt && (
                      <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-neutral-400" />
                        {habit.completedAt}
                      </span>
                    )}

                    {item.targetTab && (
                      <button
                        onClick={() => setActiveTab(item.targetTab!)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                        title={`Open in ${item.targetTab}`}
                      >
                        Detail →
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(item.key)}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                      title="Add note"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Notes */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-neutral-800/60 bg-neutral-950/30">
                    <input
                      type="text"
                      placeholder={`Notes for ${habit.label} (e.g. Surah Al-Kahf, 20 mins, etc.)`}
                      value={habit.notes || ''}
                      onChange={(e) => updateHabitNotes(item.key, e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SLEEP & WAKE ROUTINE */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              SLEEP & WAKE ROUTINE
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400">Circadian consistency baseline.</p>
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
            Consistency: <span className="text-indigo-400 font-bold">{sleepConsistencyPercentage}%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {routineItems.map((r) => {
            const currentStatus = currentDayData.routines?.[r.id] || 'pending';

            return (
              <div
                key={r.id}
                className="bg-obsidian-900 border border-neutral-800/80 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 block font-medium">
                      {r.time}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <span>{r.icon}</span> {r.title}
                    </span>
                  </div>
                </div>

                {/* 3 Segmented Options for touch */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 border border-neutral-800/70 rounded-lg">
                  {(['completed', 'partial', 'missed'] as RoutineStatus[]).map((status) => {
                    const isSelected = currentStatus === status;
                    let activeClass = 'bg-neutral-800 text-white';
                    if (isSelected) {
                      if (status === 'completed') activeClass = 'bg-emerald-600 text-white font-semibold';
                      if (status === 'partial') activeClass = 'bg-amber-600 text-white font-semibold';
                      if (status === 'missed') activeClass = 'bg-rose-900/80 text-rose-200 font-semibold';
                    }

                    return (
                      <button
                        key={status}
                        onClick={() => updateRoutineStatus(r.id, isSelected ? 'pending' : status)}
                        className={`py-1.5 sm:py-1 rounded text-[10px] sm:text-[11px] capitalize transition-colors active:scale-95 ${
                          isSelected
                            ? activeClass
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. THIS WEEK'S OUTCOMES (Quick Glance) */}
      <section className="bg-obsidian-900/60 border border-neutral-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">This Week's Outcomes</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {outcomesProgress.overall}%
            </span>
          </div>
          <button
            onClick={() => setActiveTab('week')}
            className="text-[11px] sm:text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1 transition-colors"
          >
            <span>All Tasks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Office */}
          <div onClick={() => setActiveTab('week')} className="cursor-pointer group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                🏢 Office + El Grafico Prototype
              </span>
              <span className="font-mono text-neutral-400">{outcomesProgress.office}%</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800/80">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${outcomesProgress.office}%` }}
              />
            </div>
          </div>

          {/* Personal Brand */}
          <div onClick={() => setActiveTab('week')} className="cursor-pointer group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                👤 Personal Brand — Just Start
              </span>
              <span className="font-mono text-neutral-400">{outcomesProgress.brand}%</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800/80">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${outcomesProgress.brand}%` }}
              />
            </div>
          </div>

          {/* Personal Reset */}
          <div onClick={() => setActiveTab('week')} className="cursor-pointer group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                🧠 Personal Reset
              </span>
              <span className="font-mono text-neutral-400">{outcomesProgress.reset}%</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800/80">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${outcomesProgress.reset}%` }}
              />
            </div>
          </div>

          {/* General */}
          <div onClick={() => setActiveTab('week')} className="cursor-pointer group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                🛒 General (Shopping, Home Visits, Programs)
              </span>
              <span className="font-mono text-neutral-400">{outcomesProgress.general}%</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800/80">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${outcomesProgress.general}%` }}
              />
            </div>
          </div>

          {/* Aurad */}
          <div onClick={() => setActiveTab('week')} className="cursor-pointer group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                📿 Aurad (Haddad, Yaseen, Al-Fath)
              </span>
              <span className="font-mono text-neutral-400">{outcomesProgress.aurad}%</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800/80">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${outcomesProgress.aurad}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

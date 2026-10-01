import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import { CheckCircle2 } from 'lucide-react';
import type { AIFocusComponents, EnglishFocusComponents } from '../types';

export const LearnView: React.FC = () => {
  const {
    currentDayData,
    currentWeek,
    aiWeeklySummary,
    spanishWeeklySummary,
    englishWeeklySummary,
    updateAIDiscovery,
    updateSpanish,
    updateEnglish,
  } = useResetWeek();

  type LearnSubTab = 'ai' | 'spanish' | 'english';
  const [subTab, setSubTab] = useState<LearnSubTab>('ai');

  const ai = currentDayData?.aiDiscovery || {
    toolOrTopic: '',
    whatIsNew: '',
    whyUseful: '',
    whatCanUseFor: '',
    tested: false,
    takeaway: '',
    minutesLogged: 0,
    components: {
      discovery: false,
      testing: false,
      implementation: false,
      takeaway: false,
    },
    completed: false,
  };

  const sp = currentDayData?.spanish || {
    vocabulary: false,
    listening: false,
    reading: false,
    practice: false,
    minutesLogged: 0,
    completed: false,
  };

  const eng = currentDayData?.english || {
    title: '',
    source: '',
    topic: '',
    learned: '',
    vocabulary: '',
    minutesLogged: 0,
    components: {
      reading: false,
      vocabulary: false,
      learned: false,
      speaking: false,
    },
    completed: false,
  };

  // Quick minutes additions
  const addAIMinutes = (mins: number) => {
    const newMins = (ai.minutesLogged || 0) + mins;
    updateAIDiscovery({
      minutesLogged: newMins,
      completed: newMins >= 15,
    });
  };

  const toggleAIFocus = (key: keyof AIFocusComponents) => {
    const currentComponents = ai.components || {
      discovery: false,
      testing: false,
      implementation: false,
      takeaway: false,
    };
    updateAIDiscovery({
      components: {
        ...currentComponents,
        [key]: !currentComponents[key],
      },
    });
  };

  const addSpanishMinutes = (mins: number) => {
    const newMins = (sp.minutesLogged || 0) + mins;
    updateSpanish({
      minutesLogged: newMins,
      completed: newMins >= 15,
    });
  };

  const addEnglishMinutes = (mins: number) => {
    const newMins = (eng.minutesLogged || 0) + mins;
    updateEnglish({
      minutesLogged: newMins,
      completed: newMins >= 15,
    });
  };

  const toggleEnglishFocus = (key: keyof EnglishFocusComponents) => {
    const currentComponents = eng.components || {
      reading: false,
      vocabulary: false,
      learned: false,
      speaking: false,
    };
    updateEnglish({
      components: {
        ...currentComponents,
        [key]: !currentComponents[key],
      },
    });
  };

  // Find all AI discoveries recorded across the current week
  const weeklyAIDiscoveries = Object.values(currentWeek.days)
    .filter((d) => d.aiDiscovery?.toolOrTopic?.trim())
    .map((d) => ({
      date: d.date,
      dayName: d.dayName,
      ...d.aiDiscovery,
    }));

  // Find all English articles read across current week
  const weeklyArticles = Object.values(currentWeek.days)
    .filter((d) => d.english?.title?.trim())
    .map((d) => ({
      date: d.date,
      dayName: d.dayName,
      ...d.english,
    }));

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header & Mobile-Friendly Sub-Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Cognitive Growth
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              LEARNING ENGINE
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {subTab === 'ai' ? '15m AI / 1 Tool' : subTab === 'spanish' ? '15m Spanish' : '15m English / 1 Article'}
          </span>
        </div>

        {/* Mobile Full-Width Segmented Sub-tab pills */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setSubTab('ai')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
              subTab === 'ai'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🤖 AI
          </button>
          <button
            onClick={() => setSubTab('spanish')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
              subTab === 'spanish'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🇪🇸 Spanish
          </button>
          <button
            onClick={() => setSubTab('english')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
              subTab === 'english'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* 4. DAILY AI UPDATE */}
      {subTab === 'ai' && (
        <section className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
          <div className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-elevated space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg">🤖</span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">AI UPDATE</h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                Goal: 15 min daily
              </span>
            </div>

            {/* Quick Timer / Minutes Logger */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Today's Session</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                      {ai.minutesLogged || 0}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/ 15 min</span>
                    {(ai.minutesLogged || 0) >= 15 && (
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-semibold ml-1">
                        Goal Done ✓
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => updateAIDiscovery({ minutesLogged: 0, completed: false })}
                  className="px-2 py-1 text-[11px] text-neutral-500 hover:text-neutral-300"
                  title="Reset today's minutes"
                >
                  Reset
                </button>
              </div>

              {/* Mobile Quick Add Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addAIMinutes(5)}
                  className="py-2 px-3 text-xs font-mono bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 rounded-xl transition-all border border-neutral-700 text-center font-medium"
                >
                  +5 min
                </button>
                <button
                  onClick={() => addAIMinutes(15)}
                  className="py-2 px-3 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl transition-all text-center font-semibold"
                >
                  +15 min (Goal)
                </button>
              </div>
            </div>

            {/* Daily Focus Components */}
            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Daily Focus Components
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'discovery' as const, label: 'Tool Discovery', icon: '🔍' },
                  { key: 'testing' as const, label: 'Prompt / Workflow', icon: '⚙️' },
                  { key: 'implementation' as const, label: 'Implementation', icon: '🧪' },
                  { key: 'takeaway' as const, label: 'Takeaway & Notes', icon: '📝' },
                ].map((item) => {
                  const isChecked = !!ai.components?.[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleAIFocus(item.key)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                        isChecked
                          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300'
                          : 'bg-obsidian-950/60 border-neutral-800/70 hover:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <span className="text-xs sm:text-sm">{item.icon}</span>
                        <span className="text-xs font-medium text-neutral-200">{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 border border-emerald-500 text-white'
                            : 'border-2 border-neutral-600 text-transparent'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Streak</span>
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-400 mt-0.5 block">
                  {aiWeeklySummary.streak}d
                </span>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Week Total</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5 block">
                  {aiWeeklySummary.totalMinutes}m
                </span>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Completed</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  {aiWeeklySummary.completedDays}/7
                </span>
              </div>
            </div>

            {/* AI Discovery Deep-Dive Form */}
            <div className="space-y-3 pt-3 border-t border-neutral-800/80">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Tool / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Claude 3.7 Sonnet hybrid reasoning..."
                  value={ai.toolOrTopic}
                  onChange={(e) => updateAIDiscovery({ toolOrTopic: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  What is new?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic thinking budget per API call..."
                  value={ai.whatIsNew}
                  onChange={(e) => updateAIDiscovery({ whatIsNew: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Why is it useful?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solves complex design problems without hallucination..."
                  value={ai.whyUseful}
                  onChange={(e) => updateAIDiscovery({ whyUseful: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  What can I use it for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. El Grafico client proposals & service workflows..."
                  value={ai.whatCanUseFor}
                  onChange={(e) => updateAIDiscovery({ whatCanUseFor: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Today's AI Takeaway */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-1.5">
                  Today's AI Takeaway
                </label>
                <textarea
                  rows={2}
                  value={ai.takeaway}
                  onChange={(e) => updateAIDiscovery({ takeaway: e.target.value })}
                  placeholder="The single high-leverage principle or lesson from today's test..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Past Discoveries in Current Week */}
          {weeklyAIDiscoveries.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Weekly AI Knowledge Log ({weeklyAIDiscoveries.length})
              </h4>
              <div className="space-y-2">
                {weeklyAIDiscoveries.map((disc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-obsidian-900 border border-neutral-800/80 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                      <span>{disc.dayName}</span>
                      {disc.minutesLogged && disc.minutesLogged > 0 ? (
                        <span className="text-cyan-400 font-semibold">{disc.minutesLogged}m logged</span>
                      ) : null}
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm">{disc.toolOrTopic}</div>
                    {disc.whyUseful && (
                      <p className="text-neutral-300 text-xs">{disc.whyUseful}</p>
                    )}
                    {disc.takeaway && (
                      <div className="p-2 bg-neutral-950/80 rounded-lg text-cyan-300/90 text-[11px] font-serif italic border border-neutral-800/60 mt-1">
                        “{disc.takeaway}”
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. SPANISH TRACKER */}
      {subTab === 'spanish' && (
        <section className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
          <div className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-elevated space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg">🇪🇸</span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">SPANISH TRACKER</h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Goal: 15 min daily
              </span>
            </div>

            {/* Quick Timer / Minutes Logger */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Today's Session</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                      {sp.minutesLogged || 0}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/ 15 min</span>
                    {sp.minutesLogged >= 15 && (
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-semibold ml-1">
                        Goal Done ✓
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => updateSpanish({ minutesLogged: 0, completed: false })}
                  className="px-2 py-1 text-[11px] text-neutral-500 hover:text-neutral-300"
                  title="Reset today's minutes"
                >
                  Reset
                </button>
              </div>

              {/* Mobile Quick Add Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addSpanishMinutes(5)}
                  className="py-2 px-3 text-xs font-mono bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 rounded-xl transition-all border border-neutral-700 text-center font-medium"
                >
                  +5 min
                </button>
                <button
                  onClick={() => addSpanishMinutes(15)}
                  className="py-2 px-3 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl transition-all text-center font-semibold"
                >
                  +15 min (Goal)
                </button>
              </div>
            </div>

            {/* Daily Focus Components */}
            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Daily Focus Components
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'vocabulary' as const, label: 'Vocabulary', icon: '📝' },
                  { key: 'listening' as const, label: 'Listening', icon: '🎧' },
                  { key: 'reading' as const, label: 'Reading', icon: '📖' },
                  { key: 'practice' as const, label: 'Practice', icon: '🗣️' },
                ].map((item) => {
                  const isChecked = !!sp[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => updateSpanish({ [item.key]: !isChecked })}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                        isChecked
                          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300'
                          : 'bg-obsidian-950/60 border-neutral-800/70 hover:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <span className="text-xs sm:text-sm">{item.icon}</span>
                        <span className="text-xs font-medium text-neutral-200">{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 border border-emerald-500 text-white'
                            : 'border-2 border-neutral-600 text-transparent'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spanish Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Streak</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400 mt-0.5 block">
                  {spanishWeeklySummary.streak}d
                </span>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Week Total</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5 block">
                  {spanishWeeklySummary.totalMinutes}m
                </span>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Completed</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  {spanishWeeklySummary.completedDays}/7
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. ENGLISH READING */}
      {subTab === 'english' && (
        <section className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
          <div className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-elevated space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg">🇬🇧</span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">ENGLISH READING</h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Goal: 15 min daily
              </span>
            </div>

            {/* Quick Timer / Minutes Logger */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Today's Session</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                      {eng.minutesLogged || 0}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/ 15 min</span>
                    {(eng.minutesLogged || 0) >= 15 && (
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-semibold ml-1">
                        Goal Done ✓
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => updateEnglish({ minutesLogged: 0, completed: false })}
                  className="px-2 py-1 text-[11px] text-neutral-500 hover:text-neutral-300"
                  title="Reset today's minutes"
                >
                  Reset
                </button>
              </div>

              {/* Mobile Quick Add Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addEnglishMinutes(5)}
                  className="py-2 px-3 text-xs font-mono bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 rounded-xl transition-all border border-neutral-700 text-center font-medium"
                >
                  +5 min
                </button>
                <button
                  onClick={() => addEnglishMinutes(15)}
                  className="py-2 px-3 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl transition-all text-center font-semibold"
                >
                  +15 min (Goal)
                </button>
              </div>
            </div>

            {/* Daily Focus Components */}
            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Daily Focus Components
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'reading' as const, label: 'Article Reading', icon: '📖' },
                  { key: 'vocabulary' as const, label: 'Vocab Capture', icon: '📝' },
                  { key: 'learned' as const, label: '1 Thing Learned', icon: '💡' },
                  { key: 'speaking' as const, label: 'Pronunciation', icon: '🗣️' },
                ].map((item) => {
                  const isChecked = !!eng.components?.[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleEnglishFocus(item.key)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                        isChecked
                          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300'
                          : 'bg-obsidian-950/60 border-neutral-800/70 hover:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <span className="text-xs sm:text-sm">{item.icon}</span>
                        <span className="text-xs font-medium text-neutral-200">{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 border border-emerald-500 text-white'
                            : 'border-2 border-neutral-600 text-transparent'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* English Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Streak</span>
                <span className="text-base sm:text-lg font-bold font-mono text-indigo-400 mt-0.5 block">
                  {englishWeeklySummary.streak}d
                </span>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Week Total</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5 block">
                  {englishWeeklySummary.totalMinutes}m
                </span>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/70 text-center">
                <span className="text-[10px] text-neutral-400 block font-mono">Articles</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  {englishWeeklySummary.articlesRead}
                </span>
              </div>
            </div>

            {/* English Article Inputs */}
            <div className="space-y-3 pt-3 border-t border-neutral-800/80">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. How to Do Great Work by Paul Graham..."
                  value={eng.title}
                  onChange={(e) => updateEnglish({ title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PaulGraham.com"
                    value={eng.source}
                    onChange={(e) => updateEnglish({ source: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ambition"
                    value={eng.topic}
                    onChange={(e) => updateEnglish({ topic: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  1 Thing I Learned
                </label>
                <textarea
                  rows={2}
                  value={eng.learned}
                  onChange={(e) => updateEnglish({ learned: e.target.value })}
                  placeholder="The primary mental model or lesson..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  New Vocabulary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salient, Inchoate, Proclivity..."
                  value={eng.vocabulary}
                  onChange={(e) => updateEnglish({ vocabulary: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-400">
                Articles Read: <span className="text-white font-bold">{englishWeeklySummary.articlesRead}</span>
              </span>

              {eng.readAt && (
                <span className="text-[11px] font-mono text-emerald-400">
                  Read at {eng.readAt} ✓
                </span>
              )}
            </div>
          </div>

          {/* Past Articles Read in Current Week */}
          {weeklyArticles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Articles Captured This Week ({weeklyArticles.length})
              </h4>
              <div className="space-y-2">
                {weeklyArticles.map((art, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-obsidian-900 border border-neutral-800/80 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                      <span>{art.dayName} · {art.source || 'Online'}</span>
                      {art.topic && (
                        <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                          {art.topic}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm">{art.title}</div>
                    {art.learned && (
                      <p className="text-neutral-300 text-xs mt-0.5">{art.learned}</p>
                    )}
                    {art.vocabulary && (
                      <div className="text-[10px] font-mono text-indigo-300/80 pt-0.5">
                        Vocab: {art.vocabulary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

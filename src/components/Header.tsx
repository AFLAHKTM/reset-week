import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import { Sun, Moon, Calendar, Download, Upload, RotateCcw, CheckCircle2, Cloud } from 'lucide-react';
import { parseISODate } from '../utils/dateUtils';
import { FirebaseSyncModal } from './FirebaseSyncModal';

export const Header: React.FC = () => {
  const {
    currentWeek,
    selectedDate,
    setSelectedDate,
    theme,
    toggleTheme,
    todayDate,
    exportJSON,
    importJSON,
    resetAllData,
    syncStatus,
  } = useResetWeek();

  const [showSettings, setShowSettings] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const cycleDays = Object.values(currentWeek.days).sort((a, b) => a.dayIndex - b.dayIndex);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importJSON(content);
        if (success) {
          alert('Data imported successfully!');
          setShowSettings(false);
        } else {
          alert('Failed to import file. Please check format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/85 dark:bg-obsidian-950/90 backdrop-blur-xl sticky top-0 z-40 transition-colors pt-safe">
      <div className="max-w-md md:max-w-4xl mx-auto px-3.5 sm:px-6 pt-2 pb-2.5">
        {/* Top Brand & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {currentWeek.title}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Friday → Friday
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white dark:text-neutral-100 flex items-center gap-2 mt-0.5">
                RESET WEEK
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Cloud Sync Status Pill */}
            <button
              onClick={() => setShowSyncModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all active:scale-95 border ${
                syncStatus === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : syncStatus === 'offline'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-neutral-800/60 border-neutral-700/80 text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
              title="Firebase Cloud Sync - Realtime updates on all devices"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">
                {syncStatus === 'connected' && 'Cloud Sync'}
                {syncStatus === 'syncing' && 'Syncing...'}
                {syncStatus === 'offline' && 'Offline'}
                {syncStatus === 'unconfigured' && 'Connect Cloud'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-400 animate-ping'
                    : syncStatus === 'offline'
                    ? 'bg-rose-400'
                    : 'bg-neutral-500'
                }`}
              />
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 active:scale-95 transition-all"
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings and Data"
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 active:scale-95 transition-all relative"
              title="Settings & Backup"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Motto */}
        <div className="mt-1.5 flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 border-t border-neutral-900/60 pt-1.5">
          <p className="italic font-serif tracking-wide text-neutral-300 dark:text-neutral-400 truncate">
            “Build the system. Then build the future.”
          </p>
          <span className="font-mono text-[10px] sm:text-[11px] text-neutral-500 flex-shrink-0 ml-2">
            {currentWeek.startDate.slice(5)} → {currentWeek.endDate.slice(5)}
          </span>
        </div>

        {/* 7-Day Mobile Responsive Grid */}
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-1.5">
          {cycleDays.map((d) => {
            const isSelected = d.date === selectedDate;
            const isToday = d.date === todayDate;
            const parsed = parseISODate(d.date);
            const dayNum = parsed.getDate();
            const allHabitsDone = Object.values(d.habits).every((h) => h.completed);

            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`py-1.5 px-0.5 rounded-lg text-center transition-all text-xs border flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-600 shadow-sm font-semibold scale-[1.02]'
                    : 'bg-neutral-900/40 dark:bg-obsidian-900/60 text-neutral-400 border-neutral-800/60 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-0.5">
                  <span className="text-[9px] uppercase font-mono tracking-tight opacity-75">
                    {d.dayName.slice(0, 3)}
                  </span>
                  {allHabitsDone && (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 inline" />
                  )}
                </div>
                <div className="text-[11px] sm:text-xs font-mono font-medium flex items-center justify-center gap-0.5 mt-0.5">
                  <span>{dayNum}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Today" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Settings / Data Drawer Modal */}
        {showSettings && (
          <div className="mt-2.5 p-3.5 bg-obsidian-900 border border-neutral-800 rounded-xl shadow-elevated text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-200 uppercase tracking-wider text-[10px]">
                Data & System Controls
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-neutral-500 hover:text-neutral-300 p-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={exportJSON}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700 text-xs"
              >
                <Download className="w-3.5 h-3.5 text-neutral-400" />
                <span>Export Backup (JSON)</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700 cursor-pointer text-xs">
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={resetAllData}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition-colors border border-rose-800/50 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset to Seed Data</span>
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={() => {
                  setShowSettings(false);
                  setShowSyncModal(true);
                }}
                className="w-full flex items-center justify-between p-2.5 bg-amber-500/10 hover:bg-amber-500/15 text-amber-300 rounded-xl border border-amber-500/30 transition-all text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-400" />
                  <span>Firebase Realtime Cloud Sync</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {syncStatus === 'connected' ? '🟢 Live Connected' : 'Configure ⚙️'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Firebase Cloud Sync Modal */}
        <FirebaseSyncModal
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
        />
      </div>
    </header>
  );
};

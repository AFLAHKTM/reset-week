import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { ScheduleItemType, ScheduleItem } from '../types';
import {
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  MapPin,
  User,
  CalendarClock,
  X,
} from 'lucide-react';
import { parseISODate } from '../utils/dateUtils';

export const ScheduleView: React.FC = () => {
  const {
    currentWeek,
    selectedDate,
    setSelectedDate,
    todayDate,
    dayKeys,
    todaySchedules,
    weeklySchedules,
    schedulesSummary,
    addScheduleItem,
    toggleScheduleItem,
    deleteScheduleItem,
  } = useResetWeek();

  // Mode: 'day' (filter to selectedDate) vs 'week' (all 7 days)
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  // Type filter
  const [typeFilter, setTypeFilter] = useState<'all' | ScheduleItemType>('all');
  // Expand add form
  const [isAdding, setIsAdding] = useState(false);

  // New item form state
  const [title, setTitle] = useState('');
  const [person, setPerson] = useState('');
  const [type, setType] = useState<ScheduleItemType>('meeting');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('45 min');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Items to display based on viewMode and typeFilter
  const baseItems: ScheduleItem[] =
    viewMode === 'day' ? todaySchedules : weeklySchedules;

  const filteredItems = baseItems.filter((item) => {
    if (typeFilter === 'all') return true;
    return item.type === typeFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addScheduleItem({
      title: title.trim(),
      person: person.trim() || undefined,
      type,
      date: date || selectedDate,
      time: time.trim() || '10:00 AM',
      duration: duration.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setPerson('');
    setLocation('');
    setNotes('');
    setIsAdding(false);
  };

  const getTypeBadge = (t: ScheduleItemType) => {
    switch (t) {
      case 'meeting':
        return { label: 'Meeting', icon: '🤝', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'schedule':
        return { label: 'Schedule', icon: '🗓️', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      case 'program':
        return { label: 'Program', icon: '🕌', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'visit':
        return { label: 'Home Visit', icon: '🏡', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Time & Commitments
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            MEETINGS & SCHEDULES
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            Synchronize client calls, home visits, programs & deep sessions
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
            isAdding
              ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Close' : 'Add'}</span>
        </button>
      </div>

      {/* 2. Metrics Bar (3 stats on mobile) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-obsidian-900 border border-neutral-800/80 rounded-xl text-center">
          <span className="text-[10px] text-neutral-400 font-mono block">Upcoming</span>
          <span className="text-base sm:text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
            {schedulesSummary.upcoming}
          </span>
        </div>

        <div className="p-3 bg-obsidian-900 border border-neutral-800/80 rounded-xl text-center">
          <span className="text-[10px] text-neutral-400 font-mono block">Completed</span>
          <span className="text-base sm:text-xl font-bold font-mono text-white mt-0.5 block">
            {schedulesSummary.completed}
          </span>
        </div>

        <div className="p-3 bg-obsidian-900 border border-neutral-800/80 rounded-xl text-center">
          <span className="text-[10px] text-neutral-400 font-mono block">Week Total</span>
          <span className="text-base sm:text-xl font-bold font-mono text-neutral-300 mt-0.5 block">
            {schedulesSummary.total}
          </span>
        </div>
      </div>

      {/* 3. Horizontal 7-Day Quick Strip */}
      <div className="bg-obsidian-900/60 border border-neutral-800/80 rounded-2xl p-2.5 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            Select Day
          </span>
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => setViewMode('day')}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                viewMode === 'day'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                viewMode === 'week'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Week ({weeklySchedules.length})
            </button>
          </div>
        </div>

        {/* 7-Day Grid Buttons */}
        <div className="grid grid-cols-7 gap-1">
          {dayKeys.map((dKey) => {
            const day = currentWeek.days[dKey];
            const isSelected = selectedDate === dKey && viewMode === 'day';
            const isToday = dKey === todayDate;
            const parsed = parseISODate(dKey);
            const dayShort = parsed.toLocaleDateString('en-US', { weekday: 'narrow' });
            const dayNum = parsed.getDate();
            const count = day?.schedules?.length || 0;

            return (
              <button
                key={dKey}
                onClick={() => {
                  setSelectedDate(dKey);
                  setDate(dKey);
                  setViewMode('day');
                }}
                className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center relative active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : isToday
                    ? 'bg-neutral-800/80 border border-emerald-500/40 text-neutral-200'
                    : 'bg-neutral-950/50 hover:bg-neutral-800/40 text-neutral-400'
                }`}
              >
                <span className="text-[10px] font-mono leading-none">{dayShort}</span>
                <span className="text-xs sm:text-sm font-mono mt-1 font-semibold leading-none">
                  {dayNum}
                </span>
                {count > 0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Type Filter Segmented Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {[
          { key: 'all' as const, label: 'All' },
          { key: 'meeting' as const, label: '🤝 Meetings' },
          { key: 'schedule' as const, label: '🗓️ Schedules' },
          { key: 'program' as const, label: '🕌 Programs' },
          { key: 'visit' as const, label: '🏡 Visits' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setTypeFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
              typeFilter === f.key
                ? 'bg-neutral-100 dark:bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'bg-obsidian-900 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 5. Inline Add Schedule Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-obsidian-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-elevated space-y-3.5 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
            <div className="flex items-center space-x-2">
              <CalendarClock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                New Meeting or Schedule
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: 'meeting' as const, label: 'Meeting', icon: '🤝' },
                { key: 'schedule' as const, label: 'Schedule', icon: '🗓️' },
                { key: 'program' as const, label: 'Program', icon: '🕌' },
                { key: 'visit' as const, label: 'Visit', icon: '🏡' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`py-2 px-1 text-center rounded-xl border text-[11px] font-medium transition-all ${
                    type === t.key
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  <span className="block text-xs mb-0.5">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              Title / Purpose *
            </label>
            <input
              type="text"
              placeholder="e.g. El Grafico Client Proposal Review..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          {/* Person & Location Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Person / With
              </label>
              <input
                type="text"
                placeholder="e.g. Faisal / Omar"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Location / Link
              </label>
              <input
                type="text"
                placeholder="e.g. Office / Meet"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Time & Duration Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Time
              </label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 45 min"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              Agenda & Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Review deliverables & prototype timeline..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </form>
      )}

      {/* 6. Schedule Items List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span className="font-mono text-[10px] uppercase tracking-wider">
            {viewMode === 'day' ? `Schedule for ${selectedDate}` : 'All Week Commitments'} (
            {filteredItems.length})
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-8 bg-obsidian-900/50 border border-neutral-800/80 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-xl">
              🗓️
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-200">
                No commitments scheduled
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {viewMode === 'day'
                  ? 'No meetings or schedules for this day yet.'
                  : 'No scheduled commitments found for this filter.'}
              </p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-all"
            >
              + Add First Schedule
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const badge = getTypeBadge(item.type);
            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  item.completed
                    ? 'bg-neutral-950/40 border-neutral-800/50 text-neutral-400'
                    : 'bg-obsidian-900 border-neutral-800 hover:border-neutral-700/80 text-white shadow-elevated'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleScheduleItem(item.id, item.date)}
                      className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-emerald-600 border border-emerald-500 text-white'
                          : 'border-2 border-neutral-600 text-transparent hover:border-neutral-400'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-transparent" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      {/* Badges: Time, Duration, Type */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300">
                          <Clock className="w-2.5 h-2.5 text-neutral-400" />
                          <span>{item.time}</span>
                          {item.duration && <span>· {item.duration}</span>}
                        </span>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-medium ${badge.color}`}
                        >
                          {badge.icon} {badge.label}
                        </span>

                        {viewMode === 'week' && (
                          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded">
                            {item.date}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xs sm:text-sm font-bold tracking-tight ${
                          item.completed ? 'line-through text-neutral-400' : 'text-neutral-100'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Person & Location */}
                      {(item.person || item.location) && (
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-neutral-400 font-mono">
                          {item.person && (
                            <span className="flex items-center gap-1 text-neutral-300">
                              <User className="w-3 h-3 text-neutral-500" />
                              {item.person}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1 text-neutral-400">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              {item.location}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className="text-[11px] text-neutral-400 font-light mt-1 bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/60">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {item.completedAt && (
                      <span className="text-[10px] font-mono text-emerald-400 hidden sm:inline">
                        Done {item.completedAt}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteScheduleItem(item.id, item.date)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

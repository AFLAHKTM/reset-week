import React from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { TabType } from '../types';
import {
  Compass,
  CheckSquare,
  CalendarClock,
  BookOpen,
  CircleDollarSign,
  Award,
  Plus,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsQuickAddOpen } = useResetWeek();

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'week', label: 'Week', icon: CheckSquare },
    { id: 'schedule', label: 'Schedule', icon: CalendarClock },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'finance', label: 'Finance', icon: CircleDollarSign },
    { id: 'review', label: 'Review', icon: Award },
  ];

  return (
    <>
      {/* Floating Action Button (+) */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        aria-label="Quick Add"
        className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-4 sm:right-6 z-40 bg-neutral-100 hover:bg-white text-neutral-950 p-3.5 rounded-full shadow-2xl border border-neutral-300 dark:border-neutral-700 active:scale-90 transition-all flex items-center justify-center group"
        title="Quick Add (+)"
      >
        <Plus className="w-5 h-5 text-neutral-950 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Mobile-First Bottom Dock Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/90 dark:bg-obsidian-950/95 backdrop-blur-xl border-t border-neutral-800/80 transition-colors">
        <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom,0px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all relative active:scale-95 ${
                  isActive
                    ? 'text-white dark:text-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-8 h-0.5 bg-emerald-500 rounded-full animate-in fade-in duration-200" />
                )}
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] sm:text-[11px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

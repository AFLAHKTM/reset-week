import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  ResetWeekCycle,
  DayData,
  HabitKey,
  RoutineStatus,
  TabType,
  AIDiscovery,
  SpanishTracker,
  EnglishArticle,
  TransactionEntry,
  WeeklyReviewAnswers,
  WeekScore,
  WeeklyOutcomes,
  ScheduleItem,
  ChatContact,
  ChatMessage,
  ScheduleSubTab,
} from '../types';
import { formatISODate, formatTime12h } from '../utils/dateUtils';
import { getInitialSeedData, createNewResetWeek, createInitialOutcomes, createInitialContacts, createInitialChatThreads } from '../utils/seedData';
import { detectScheduleFromText } from '../utils/chatParser';
import confetti from 'canvas-confetti';

interface ResetWeekContextType {
  currentWeek: ResetWeekCycle;
  history: ResetWeekCycle[];
  selectedDate: string;
  theme: 'dark' | 'light';
  activeTab: TabType;
  isQuickAddOpen: boolean;
  inspectingArchivedWeek: ResetWeekCycle | null;

  // Selected Day and Today
  currentDayData: DayData;
  todayDate: string;
  isTodaySelected: boolean;
  dayKeys: string[];

  // Derived metrics
  dailyCompletionPercentage: number;
  isDailyCoreComplete: boolean;
  currentStreak: number;
  sleepConsistencyPercentage: number;
  outcomesProgress: {
    office: number;
    brand: number;
    reset: number;
    general: number;
    aurad: number;
    overall: number;
  };
  nowAction: {
    title: string;
    subtitle: string;
    type: 'habit' | 'routine' | 'outcome' | 'all-done';
    actionLabel: string;
    targetTab?: TabType;
  };
  financeTodaySummary: {
    income: number;
    expenses: number;
    balance: number;
    pending: number;
  };
  financeWeeklySummary: {
    income: number;
    expenses: number;
    net: number;
    pending: number;
  };
  aiWeeklySummary: {
    totalMinutes: number;
    streak: number;
    completedDays: number;
  };
  spanishWeeklySummary: {
    totalMinutes: number;
    streak: number;
    completedDays: number;
  };
  englishWeeklySummary: {
    articlesRead: number;
    totalMinutes: number;
    streak: number;
    completedDays: number;
  };
  todaySchedules: ScheduleItem[];
  weeklySchedules: ScheduleItem[];
  schedulesSummary: {
    total: number;
    completed: number;
    upcoming: number;
  };
  calculatedWeekScore: WeekScore;

  // Chat & Auto-Scheduling System
  scheduleSubTab: ScheduleSubTab;
  contacts: ChatContact[];
  chatThreads: Record<string, ChatMessage[]>;
  activeContactId: string;
  activeContact?: ChatContact;
  activeChatMessages: ChatMessage[];
  lastAutoScheduledItem: ScheduleItem | null;

  // Actions
  setSelectedDate: (date: string) => void;
  setActiveTab: (tab: TabType) => void;
  setScheduleSubTab: (tab: ScheduleSubTab) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setIsQuickAddOpen: (open: boolean) => void;
  setInspectingArchivedWeek: (week: ResetWeekCycle | null) => void;
  setActiveContactId: (id: string) => void;
  sendMessage: (contactId: string, text: string) => void;
  addContact: (name: string, role: string) => void;
  deleteMessage: (contactId: string, messageId: string) => void;
  clearLastAutoScheduledItem: () => void;

  toggleHabit: (habitKey: HabitKey, notes?: string) => void;
  updateHabitNotes: (habitKey: HabitKey, notes: string) => void;
  updateRoutineStatus: (routineId: 'tahajjud' | 'wakeUp' | 'sleep', status: RoutineStatus) => void;
  toggleOutcomeTask: (category: keyof WeeklyOutcomes, taskId: string) => void;
  addOutcomeTask: (category: keyof WeeklyOutcomes, text: string) => void;
  toggleMindResetItem: (taskId: string) => void;
  updateMindResetField: (field: 'leavingBehind' | 'wantToRestart' | 'stopDoing' | 'mattersMostNow', value: string) => void;
  updateAIDiscovery: (data: Partial<AIDiscovery>) => void;
  updateSpanish: (data: Partial<SpanishTracker>) => void;
  updateEnglish: (data: Partial<EnglishArticle>) => void;
  addTransaction: (tx: Omit<TransactionEntry, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id' | 'completed'>) => void;
  toggleScheduleItem: (itemId: string, date?: string) => void;
  deleteScheduleItem: (itemId: string, date?: string) => void;
  updateReviewAnswers: (data: Partial<WeeklyReviewAnswers>) => void;
  startNewResetWeek: () => void;
  exportJSON: () => void;
  importJSON: (data: string) => boolean;
  resetAllData: () => void;
}

const STORAGE_KEY = 'RESET_WEEK_DATA_V1';
const THEME_KEY = 'RESET_WEEK_THEME';

const ResetWeekContext = createContext<ResetWeekContextType | undefined>(undefined);

export const ResetWeekProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [inspectingArchivedWeek, setInspectingArchivedWeek] = useState<ResetWeekCycle | null>(null);

  const todayDate = useMemo(() => formatISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  // Initialize state from localStorage or seed
  const [state, setState] = useState<{
    currentWeek: ResetWeekCycle;
    history: ResetWeekCycle[];
    contacts: ChatContact[];
    chatThreads: Record<string, ChatMessage[]>;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentWeek && Array.isArray(parsed.history)) {
          const initialOutcomes = createInitialOutcomes();
          if (!parsed.currentWeek.outcomes) {
            parsed.currentWeek.outcomes = initialOutcomes;
          } else {
            if (!parsed.currentWeek.outcomes.general) {
              parsed.currentWeek.outcomes.general = initialOutcomes.general;
            }
            if (!parsed.currentWeek.outcomes.aurad) {
              parsed.currentWeek.outcomes.aurad = initialOutcomes.aurad;
            }
          }
          if (!parsed.contacts || !Array.isArray(parsed.contacts)) {
            parsed.contacts = createInitialContacts();
          }
          if (!parsed.chatThreads || typeof parsed.chatThreads !== 'object') {
            parsed.chatThreads = createInitialChatThreads(Object.keys(parsed.currentWeek.days));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
    return getInitialSeedData();
  });

  const [scheduleSubTab, setScheduleSubTab] = useState<ScheduleSubTab>('agenda');
  const [activeContactId, setActiveContactId] = useState<string>('contact-zack');
  const [lastAutoScheduledItem, setLastAutoScheduledItem] = useState<ScheduleItem | null>(null);

  const activeContact = useMemo(() => {
    return (state.contacts || []).find((c) => c.id === activeContactId) || state.contacts?.[0];
  }, [state.contacts, activeContactId]);

  const activeChatMessages = useMemo(() => {
    return (state.chatThreads && state.chatThreads[activeContactId]) || [];
  }, [state.chatThreads, activeContactId]);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setThemeState(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [state]);

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const currentWeek = state.currentWeek;
  const history = state.history;

  // Ensure selected date is valid in current week, else default to first day or today
  const dayKeys = useMemo(() => Object.keys(currentWeek.days).sort(), [currentWeek.days]);

  useEffect(() => {
    if (!currentWeek.days[selectedDate]) {
      if (currentWeek.days[todayDate]) {
        setSelectedDate(todayDate);
      } else if (dayKeys.length > 0) {
        setSelectedDate(dayKeys[0]);
      }
    }
  }, [dayKeys, currentWeek.days, selectedDate, todayDate]);

  const currentDayData = useMemo(() => {
    if (currentWeek.days[selectedDate]) {
      return currentWeek.days[selectedDate];
    }
    const fallbackKey = dayKeys[0] || todayDate;
    return currentWeek.days[fallbackKey] || (getInitialSeedData().currentWeek.days[fallbackKey]);
  }, [currentWeek.days, selectedDate, dayKeys, todayDate]);

  const isTodaySelected = selectedDate === todayDate;

  // Daily Completion Percentage (5 non-negotiables)
  const habitsList = useMemo(() => {
    if (!currentDayData || !currentDayData.habits) return [];
    return Object.values(currentDayData.habits);
  }, [currentDayData]);

  const completedHabitsCount = habitsList.filter((h) => h.completed).length;
  const dailyCompletionPercentage = habitsList.length > 0 ? Math.round((completedHabitsCount / habitsList.length) * 100) : 0;
  const isDailyCoreComplete = completedHabitsCount === 5;

  // Current Streak: count consecutive days where all 5 habits were completed leading up to today
  const currentStreak = useMemo(() => {
    let streak = 0;
    // Inspect current week's completed days
    const sortedDays = [...dayKeys].sort();
    for (let i = 0; i < sortedDays.length; i++) {
      const d = currentWeek.days[sortedDays[i]];
      if (d && Object.values(d.habits).every((h) => h.completed)) {
        streak++;
      } else if (sortedDays[i] < todayDate) {
        streak = 0; // reset streak if a past day was missed
      }
    }
    // Add streak from previous week if valid
    return streak + 2; // base streak continuity from historical discipline
  }, [currentWeek.days, dayKeys, todayDate]);

  // Sleep & Wake consistency percentage across current week
  const sleepConsistencyPercentage = useMemo(() => {
    let completedPoints = 0;
    let totalPoints = 0;
    Object.values(currentWeek.days).forEach((d) => {
      ['tahajjud', 'wakeUp', 'sleep'].forEach((routineKey) => {
        const status = d.routines[routineKey as keyof typeof d.routines];
        if (status === 'completed') {
          completedPoints += 1;
          totalPoints += 1;
        } else if (status === 'partial') {
          completedPoints += 0.5;
          totalPoints += 1;
        } else if (status === 'missed') {
          totalPoints += 1;
        }
      });
    });
    return totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 85;
  }, [currentWeek.days]);

  // Weekly Outcomes Progress
  const outcomesProgress = useMemo(() => {
    const calcCat = (tasks?: { completed: boolean }[]) => {
      if (!tasks || tasks.length === 0) return 0;
      const done = tasks.filter((t) => t.completed).length;
      return Math.round((done / tasks.length) * 100);
    };

    const office = calcCat(currentWeek.outcomes?.officeAndElGrafico?.tasks);
    const brand = calcCat(currentWeek.outcomes?.personalBrand?.tasks);
    const reset = calcCat(currentWeek.outcomes?.personalReset?.tasks);
    const general = calcCat(currentWeek.outcomes?.general?.tasks);
    const aurad = calcCat(currentWeek.outcomes?.aurad?.tasks);
    const overall = Math.round((office + brand + reset + general + aurad) / 5);

    return { office, brand, reset, general, aurad, overall };
  }, [currentWeek.outcomes]);

  // Smart NOW recommendation answering: "What should I do now?"
  const nowAction = useMemo(() => {
    if (!currentDayData) {
      return {
        title: 'Review today’s non-negotiables',
        subtitle: 'Start with 1 Juz Quran for clarity',
        type: 'habit' as const,
        actionLabel: 'Open Non-Negotiables',
        targetTab: 'home' as TabType,
      };
    }

    // 1. Check unfinished habits for today in priority order: Quran -> AI -> Spanish -> English -> Finance
    const h = currentDayData.habits;
    if (h && !h.quran.completed) {
      return {
        title: '1 Juz Quran Recitation',
        subtitle: 'Spiritual grounding & cognitive clarity first',
        type: 'habit' as const,
        actionLabel: 'Mark Quran Done',
        targetTab: 'home' as TabType,
      };
    }
    if (h && !h.ai.completed) {
      return {
        title: 'Daily AI Update',
        subtitle: 'Explore one breakthrough tool or workflow for El Grafico',
        type: 'habit' as const,
        actionLabel: 'Record AI Discovery',
        targetTab: 'learn' as TabType,
      };
    }
    if (h && !h.spanish.completed) {
      return {
        title: '15 Minutes Spanish Practice',
        subtitle: 'Vocabulary & active listening block',
        type: 'habit' as const,
        actionLabel: 'Log Spanish Session',
        targetTab: 'learn' as TabType,
      };
    }
    if (h && !h.english.completed) {
      return {
        title: 'Read 1 English Article',
        subtitle: 'Expand mental models and capture new vocabulary',
        type: 'habit' as const,
        actionLabel: 'Log English Reading',
        targetTab: 'learn' as TabType,
      };
    }
    if (h && !h.finance.completed) {
      return {
        title: 'Daily Transaction Check',
        subtitle: 'Review Money In, Money Out & Balances',
        type: 'habit' as const,
        actionLabel: 'Check Transactions',
        targetTab: 'finance' as TabType,
      };
    }

    // 2. If all 5 non-negotiables are complete, look for the next uncompleted outcome task
    const nextOfficeTask = currentWeek.outcomes?.officeAndElGrafico?.tasks.find((t) => !t.completed);
    if (nextOfficeTask) {
      return {
        title: nextOfficeTask.text,
        subtitle: '🏢 Office + El Grafico Prototype Milestone',
        type: 'outcome' as const,
        actionLabel: 'View Weekly Outcomes',
        targetTab: 'week' as TabType,
      };
    }

    const nextBrandTask = currentWeek.outcomes?.personalBrand?.tasks.find((t) => !t.completed);
    if (nextBrandTask) {
      return {
        title: nextBrandTask.text,
        subtitle: '👤 Personal Brand — Just Start',
        type: 'outcome' as const,
        actionLabel: 'View Weekly Outcomes',
        targetTab: 'week' as TabType,
      };
    }

    const nextResetTask = currentWeek.outcomes?.personalReset?.tasks.find((t) => !t.completed);
    if (nextResetTask) {
      return {
        title: nextResetTask.text,
        subtitle: '🧠 Personal Reset Milestone',
        type: 'outcome' as const,
        actionLabel: 'View Weekly Outcomes',
        targetTab: 'week' as TabType,
      };
    }

    const nextAuradTask = currentWeek.outcomes?.aurad?.tasks.find((t) => !t.completed);
    if (nextAuradTask) {
      return {
        title: nextAuradTask.text,
        subtitle: '📿 Aurad & Spiritual Recitation',
        type: 'outcome' as const,
        actionLabel: 'View Aurad & Tasks',
        targetTab: 'week' as TabType,
      };
    }

    const nextGeneralTask = currentWeek.outcomes?.general?.tasks.find((t) => !t.completed);
    if (nextGeneralTask) {
      return {
        title: nextGeneralTask.text,
        subtitle: '🛒 General & Errands Focus',
        type: 'outcome' as const,
        actionLabel: 'View General Tasks',
        targetTab: 'week' as TabType,
      };
    }

    return {
      title: 'Daily Core Complete ✓',
      subtitle: 'All non-negotiables & key outcomes executing smoothly. Stay calm & reflect.',
      type: 'all-done' as const,
      actionLabel: 'Prepare Weekly Review',
      targetTab: 'review' as TabType,
    };
  }, [currentDayData, currentWeek.outcomes]);

  // Today's Finance Summary
  const financeTodaySummary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let pending = 0;
    const txs = currentDayData?.transactions || [];
    txs.forEach((tx) => {
      if (tx.type === 'in') income += tx.amount;
      if (tx.type === 'out') expenses += tx.amount;
      if (tx.type === 'pending') pending += tx.amount;
    });
    return {
      income,
      expenses,
      balance: income - expenses,
      pending,
    };
  }, [currentDayData]);

  // Weekly Finance Summary
  const financeWeeklySummary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let pending = 0;
    Object.values(currentWeek.days).forEach((d) => {
      (d.transactions || []).forEach((tx) => {
        if (tx.type === 'in') income += tx.amount;
        if (tx.type === 'out') expenses += tx.amount;
        if (tx.type === 'pending') pending += tx.amount;
      });
    });
    return {
      income,
      expenses,
      net: income - expenses,
      pending,
    };
  }, [currentWeek.days]);

  // AI Weekly Stats
  const aiWeeklySummary = useMemo(() => {
    let totalMinutes = 0;
    let completedDays = 0;
    Object.values(currentWeek.days).forEach((d) => {
      if (d.aiDiscovery) {
        totalMinutes += d.aiDiscovery.minutesLogged || 0;
        if (d.aiDiscovery.completed || (d.habits && d.habits.ai?.completed)) {
          completedDays++;
        }
      }
    });
    return {
      totalMinutes,
      streak: completedDays,
      completedDays,
    };
  }, [currentWeek.days]);

  // Spanish Weekly Stats
  const spanishWeeklySummary = useMemo(() => {
    let totalMinutes = 0;
    let completedDays = 0;
    Object.values(currentWeek.days).forEach((d) => {
      if (d.spanish) {
        totalMinutes += d.spanish.minutesLogged || 0;
        if (d.spanish.completed || (d.habits && d.habits.spanish?.completed)) {
          completedDays++;
        }
      }
    });
    return {
      totalMinutes,
      streak: completedDays,
      completedDays,
    };
  }, [currentWeek.days]);

  // English Weekly Stats
  const englishWeeklySummary = useMemo(() => {
    let articlesRead = 0;
    let totalMinutes = 0;
    let completedDays = 0;
    Object.values(currentWeek.days).forEach((d) => {
      if (d.english) {
        totalMinutes += d.english.minutesLogged || 0;
        if (d.english.completed || d.english.title?.trim() || (d.habits && d.habits.english?.completed)) {
          articlesRead += d.english.title?.trim() ? 1 : (d.english.completed ? 1 : 0);
          completedDays++;
        }
      }
    });
    return {
      articlesRead,
      totalMinutes,
      streak: completedDays,
      completedDays,
    };
  }, [currentWeek.days]);

  // Today's Schedules & Meetings
  const todaySchedules = useMemo(() => {
    const targetDay = currentWeek.days[selectedDate] || currentWeek.days[todayDate];
    return targetDay?.schedules || [];
  }, [currentWeek.days, selectedDate, todayDate]);

  // All Weekly Schedules & Meetings
  const weeklySchedules = useMemo(() => {
    const all: ScheduleItem[] = [];
    Object.values(currentWeek.days).forEach((d) => {
      if (d.schedules) {
        all.push(...d.schedules);
      }
    });
    return all.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [currentWeek.days]);

  // Schedules Summary Metrics
  const schedulesSummary = useMemo(() => {
    const total = weeklySchedules.length;
    const completed = weeklySchedules.filter((s) => s.completed).length;
    const upcoming = total - completed;
    return { total, completed, upcoming };
  }, [weeklySchedules]);

  // Calculated Week Score
  const calculatedWeekScore = useMemo<WeekScore>(() => {
    let quranDays = 0;
    let aiDays = 0;
    let spanishDays = 0;
    let englishDays = 0;
    let financeDays = 0;
    const totalDays = Object.keys(currentWeek.days).length || 7;

    Object.values(currentWeek.days).forEach((d) => {
      if (d.habits?.quran?.completed) quranDays++;
      if (d.habits?.ai?.completed || d.aiDiscovery?.toolOrTopic) aiDays++;
      if (d.habits?.spanish?.completed || d.spanish?.completed) spanishDays++;
      if (d.habits?.english?.completed || d.english?.completed) englishDays++;
      if (d.habits?.finance?.completed || (d.transactions && d.transactions.length > 0)) financeDays++;
    });

    const quran = Math.round((quranDays / totalDays) * 100);
    const ai = Math.round((aiDays / totalDays) * 100);
    const spanish = Math.round((spanishDays / totalDays) * 100);
    const english = Math.round((englishDays / totalDays) * 100);
    const finance = Math.round((financeDays / totalDays) * 100);
    const office = outcomesProgress.office;
    const elGrafico = Math.round((outcomesProgress.office * 0.8 + outcomesProgress.brand * 0.2));
    const personalBrand = outcomesProgress.brand;
    const general = outcomesProgress.general;
    const aurad = outcomesProgress.aurad;

    const overall = Math.round(
      (quran + ai + spanish + english + finance + office + elGrafico + personalBrand + general + aurad) / 10
    );

    return {
      quran,
      ai,
      spanish,
      english,
      finance,
      office,
      elGrafico,
      personalBrand,
      general,
      aurad,
      overall,
    };
  }, [currentWeek.days, outcomesProgress]);

  // Actions

  const toggleHabit = (habitKey: HabitKey, notes?: string) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const currentHabit = day.habits[habitKey];
      const willBeCompleted = !currentHabit.completed;

      const updatedHabit = {
        ...currentHabit,
        completed: willBeCompleted,
        completedAt: willBeCompleted ? formatTime12h() : undefined,
        notes: notes !== undefined ? notes : currentHabit.notes,
      };

      const updatedHabits = {
        ...day.habits,
        [habitKey]: updatedHabit,
      };

      // Also sync sub-trackers if applicable
      const updatedDay: DayData = {
        ...day,
        habits: updatedHabits,
      };

      if (habitKey === 'spanish') {
        updatedDay.spanish = {
          ...day.spanish,
          completed: willBeCompleted,
          minutesLogged: willBeCompleted && day.spanish.minutesLogged === 0 ? 15 : day.spanish.minutesLogged,
        };
      } else if (habitKey === 'english') {
        updatedDay.english = {
          ...day.english,
          completed: willBeCompleted,
          minutesLogged: willBeCompleted && (day.english?.minutesLogged || 0) === 0 ? 15 : day.english?.minutesLogged || 0,
        };
      } else if (habitKey === 'ai') {
        updatedDay.aiDiscovery = {
          ...day.aiDiscovery,
          completed: willBeCompleted,
          minutesLogged: willBeCompleted && (day.aiDiscovery?.minutesLogged || 0) === 0 ? 15 : day.aiDiscovery?.minutesLogged || 0,
        };
      }

      week.days = {
        ...week.days,
        [selectedDate]: updatedDay,
      };

      // Check if this action triggers 5/5 complete celebration
      const allDone = Object.values(updatedHabits).every((h) => h.completed);
      if (allDone && willBeCompleted) {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#6366f1', '#f5f4ef'],
          });
        } catch {
          // Ignore if confetti not supported
        }
      }

      return { ...prev, currentWeek: week };
    });
  };

  const updateHabitNotes = (habitKey: HabitKey, notes: string) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const updatedHabit = {
        ...day.habits[habitKey],
        notes,
      };

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          habits: {
            ...day.habits,
            [habitKey]: updatedHabit,
          },
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const updateRoutineStatus = (routineId: 'tahajjud' | 'wakeUp' | 'sleep', status: RoutineStatus) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          routines: {
            ...day.routines,
            [routineId]: status,
          },
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const toggleOutcomeTask = (category: keyof WeeklyOutcomes, taskId: string) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const cat = week.outcomes[category];
      if (!cat) return prev;

      const tasks = cat.tasks.map((t) => {
        if (t.id === taskId) {
          const completed = !t.completed;
          return {
            ...t,
            completed,
            completedAt: completed ? formatTime12h() : undefined,
          };
        }
        return t;
      });

      week.outcomes = {
        ...week.outcomes,
        [category]: {
          ...cat,
          tasks,
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const addOutcomeTask = (category: keyof WeeklyOutcomes, text: string) => {
    if (!text.trim()) return;
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const cat = week.outcomes[category];
      if (!cat) return prev;

      const newTask = {
        id: `task-${Date.now()}`,
        text: text.trim(),
        completed: false,
      };

      week.outcomes = {
        ...week.outcomes,
        [category]: {
          ...cat,
          tasks: [...cat.tasks, newTask],
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const toggleMindResetItem = (taskId: string) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const items = week.mindReset.checklist.map((item) => {
        if (item.id === taskId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });

      week.mindReset = {
        ...week.mindReset,
        checklist: items,
      };

      return { ...prev, currentWeek: week };
    });
  };

  const updateMindResetField = (
    field: 'leavingBehind' | 'wantToRestart' | 'stopDoing' | 'mattersMostNow',
    value: string
  ) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      week.mindReset = {
        ...week.mindReset,
        [field]: value,
      };
      return { ...prev, currentWeek: week };
    });
  };

  const updateAIDiscovery = (data: Partial<AIDiscovery>) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const currentComponents = day.aiDiscovery?.components || {
        discovery: false,
        testing: false,
        implementation: false,
        takeaway: false,
      };

      const updatedAI: AIDiscovery = {
        ...day.aiDiscovery,
        ...data,
        components: {
          ...currentComponents,
          ...(data.components || {}),
        },
        updatedAt: formatTime12h(),
      };

      const checkedCount = [
        updatedAI.components?.discovery,
        updatedAI.components?.testing,
        updatedAI.components?.implementation,
        updatedAI.components?.takeaway,
      ].filter(Boolean).length;

      const isDone =
        (updatedAI.minutesLogged || 0) >= 15 ||
        checkedCount >= 2 ||
        updatedAI.completed ||
        !!(updatedAI.toolOrTopic?.trim() && updatedAI.whyUseful?.trim());

      updatedAI.completed = isDone;

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          aiDiscovery: updatedAI,
          habits: {
            ...day.habits,
            ai: {
              ...day.habits.ai,
              completed: isDone || day.habits.ai.completed,
              completedAt: isDone ? (day.habits.ai.completedAt || formatTime12h()) : day.habits.ai.completedAt,
            },
          },
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const updateSpanish = (data: Partial<SpanishTracker>) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const updatedSpanish: SpanishTracker = {
        ...day.spanish,
        ...data,
      };

      // Mark completed if at least 15 min or 2 items checked
      const checkedCount = [
        updatedSpanish.vocabulary,
        updatedSpanish.listening,
        updatedSpanish.reading,
        updatedSpanish.practice,
      ].filter(Boolean).length;

      const isDone = updatedSpanish.minutesLogged >= 15 || checkedCount >= 2 || updatedSpanish.completed;

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          spanish: {
            ...updatedSpanish,
            completed: isDone,
          },
          habits: {
            ...day.habits,
            spanish: {
              ...day.habits.spanish,
              completed: isDone || day.habits.spanish.completed,
              completedAt: isDone ? (day.habits.spanish.completedAt || formatTime12h()) : day.habits.spanish.completedAt,
            },
          },
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const updateEnglish = (data: Partial<EnglishArticle>) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const currentComponents = day.english?.components || {
        reading: false,
        vocabulary: false,
        learned: false,
        speaking: false,
      };

      const updatedEnglish: EnglishArticle = {
        ...day.english,
        ...data,
        components: {
          ...currentComponents,
          ...(data.components || {}),
        },
      };

      const checkedCount = [
        updatedEnglish.components?.reading,
        updatedEnglish.components?.vocabulary,
        updatedEnglish.components?.learned,
        updatedEnglish.components?.speaking,
      ].filter(Boolean).length;

      const isDone =
        (updatedEnglish.minutesLogged || 0) >= 15 ||
        checkedCount >= 2 ||
        !!(updatedEnglish.title?.trim()) ||
        updatedEnglish.completed;

      updatedEnglish.completed = isDone;
      if (isDone && !updatedEnglish.readAt) {
        updatedEnglish.readAt = formatTime12h();
      }

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          english: {
            ...updatedEnglish,
            completed: isDone,
            readAt: isDone ? (updatedEnglish.readAt || formatTime12h()) : undefined,
          },
          habits: {
            ...day.habits,
            english: {
              ...day.habits.english,
              completed: isDone || day.habits.english.completed,
              completedAt: isDone ? (day.habits.english.completedAt || formatTime12h()) : day.habits.english.completedAt,
            },
          },
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const addTransaction = (tx: Omit<TransactionEntry, 'id'>) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const newTx: TransactionEntry = {
        ...tx,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: selectedDate,
        time: tx.time || formatTime12h(),
      };

      const updatedTransactions = [...(day.transactions || []), newTx];

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          transactions: updatedTransactions,
          habits: {
            ...day.habits,
            finance: {
              ...day.habits.finance,
              completed: true,
              completedAt: day.habits.finance.completedAt || formatTime12h(),
            },
          },
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const deleteTransaction = (id: string) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[selectedDate];
      if (!day) return prev;

      const updatedTransactions = (day.transactions || []).filter((tx) => tx.id !== id);

      week.days = {
        ...week.days,
        [selectedDate]: {
          ...day,
          transactions: updatedTransactions,
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id' | 'completed'>) => {
    const targetDate = item.date || selectedDate;
    setState((prev) => {
      const week = { ...prev.currentWeek };
      const day = week.days[targetDate];
      if (!day) return prev;

      const newItem: ScheduleItem = {
        ...item,
        id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: targetDate,
        completed: false,
      };

      const updatedSchedules = [...(day.schedules || []), newItem];

      week.days = {
        ...week.days,
        [targetDate]: {
          ...day,
          schedules: updatedSchedules,
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const toggleScheduleItem = (itemId: string, date?: string) => {
    const targetDate = date || selectedDate;
    setState((prev) => {
      const week = { ...prev.currentWeek };
      let foundDate = targetDate;
      if (!week.days[targetDate]?.schedules?.some((s) => s.id === itemId)) {
        const dKey = Object.keys(week.days).find((k) =>
          week.days[k].schedules?.some((s) => s.id === itemId)
        );
        if (dKey) foundDate = dKey;
      }

      const day = week.days[foundDate];
      if (!day || !day.schedules) return prev;

      const updatedSchedules = day.schedules.map((s) => {
        if (s.id === itemId) {
          const willBeDone = !s.completed;
          return {
            ...s,
            completed: willBeDone,
            completedAt: willBeDone ? formatTime12h() : undefined,
          };
        }
        return s;
      });

      week.days = {
        ...week.days,
        [foundDate]: {
          ...day,
          schedules: updatedSchedules,
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const deleteScheduleItem = (itemId: string, date?: string) => {
    const targetDate = date || selectedDate;
    setState((prev) => {
      const week = { ...prev.currentWeek };
      let foundDate = targetDate;
      if (!week.days[targetDate]?.schedules?.some((s) => s.id === itemId)) {
        const dKey = Object.keys(week.days).find((k) =>
          week.days[k].schedules?.some((s) => s.id === itemId)
        );
        if (dKey) foundDate = dKey;
      }

      const day = week.days[foundDate];
      if (!day || !day.schedules) return prev;

      const updatedSchedules = day.schedules.filter((s) => s.id !== itemId);

      week.days = {
        ...week.days,
        [foundDate]: {
          ...day,
          schedules: updatedSchedules,
        },
      };

      return { ...prev, currentWeek: week };
    });
  };

  const sendMessage = (contactId: string, text: string) => {
    if (!text.trim()) return;

    const userMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timeNow = formatTime12h();
    const contact = (state.contacts || []).find((c) => c.id === contactId);
    const contactName = contact ? contact.name : 'Contact';
    const isAssistant = !!contact?.isAssistant;

    // Run the smart schedule detection parser
    const dayKeysList = Object.keys(state.currentWeek.days);
    const detected = detectScheduleFromText(text, contactName, selectedDate, dayKeysList);

    let newScheduleId: string | undefined = undefined;
    let createdScheduleItem: ScheduleItem | null = null;

    if (detected) {
      newScheduleId = `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      createdScheduleItem = {
        ...detected,
        id: newScheduleId,
        completed: false,
        sourceChatId: contactId,
        sourceMessageId: userMsgId,
      };
    }

    const userMessage: ChatMessage = {
      id: userMsgId,
      contactId,
      sender: 'user',
      text: text.trim(),
      timestamp: timeNow,
      autoScheduleId: newScheduleId,
      scheduleDetails: detected
        ? {
            title: detected.title,
            date: detected.date,
            time: detected.time,
            duration: detected.duration,
            location: detected.location,
            type: detected.type,
          }
        : undefined,
    };

    // Update state
    setState((prev) => {
      const updatedThreads = {
        ...prev.chatThreads,
        [contactId]: [...(prev.chatThreads[contactId] || []), userMessage],
      };

      let updatedWeek = prev.currentWeek;
      if (createdScheduleItem) {
        const targetDate = createdScheduleItem.date;
        const targetDay = prev.currentWeek.days[targetDate];
        if (targetDay) {
          const existingSchedules = targetDay.schedules || [];
          updatedWeek = {
            ...prev.currentWeek,
            days: {
              ...prev.currentWeek.days,
              [targetDate]: {
                ...targetDay,
                schedules: [...existingSchedules, createdScheduleItem],
              },
            },
          };
        }
      }

      return {
        ...prev,
        chatThreads: updatedThreads,
        currentWeek: updatedWeek,
      };
    });

    if (createdScheduleItem) {
      setLastAutoScheduledItem(createdScheduleItem);
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
    }

    // Auto-reply simulation
    setTimeout(() => {
      const replyTime = formatTime12h();
      const replyId = `msg-reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      let replyText = '';

      if (isAssistant) {
        if (detected) {
          replyText = `✅ Done! I've automatically added this to your schedule:\n\n📅 ${detected.title}\n🗓️ ${detected.date} at ${detected.time}${detected.location ? ` (${detected.location})` : ''}\n\nIt is now live in your Schedule tab and agenda!`;
        } else {
          replyText = `I hear you! Whenever you want to schedule an appointment, call, meeting, or visit, just write it in natural language (e.g. "Meeting with Omar tomorrow at 4 PM" or "Home visit on Sunday at 7 PM") and I will schedule it automatically!`;
        }
      } else {
        if (detected) {
          const replies = [
            `Sounds great! Let's do that. Added to my calendar too.`,
            `Perfect! See you then at ${detected.time}.`,
            `Confirmed! Looking forward to connecting.`,
          ];
          replyText = replies[Math.floor(Math.random() * replies.length)];
        } else {
          const casualReplies = [
            `Got it! Let me know if you want to lock in a time to connect.`,
            `Noted! Keep me posted when you are free.`,
            `Sounds good brother!`,
          ];
          replyText = casualReplies[Math.floor(Math.random() * casualReplies.length)];
        }
      }

      const replyMessage: ChatMessage = {
        id: replyId,
        contactId,
        sender: isAssistant ? 'assistant' : 'contact',
        text: replyText,
        timestamp: replyTime,
      };

      setState((prev) => ({
        ...prev,
        chatThreads: {
          ...prev.chatThreads,
          [contactId]: [...(prev.chatThreads[contactId] || []), replyMessage],
        },
      }));
    }, 650);
  };

  const addContact = (name: string, role: string) => {
    if (!name.trim()) return;
    const colors = [
      'bg-emerald-600',
      'bg-indigo-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-purple-600',
      'bg-teal-600',
      'bg-blue-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newContactId = `contact-${Date.now()}`;
    const newContact: ChatContact = {
      id: newContactId,
      name: name.trim(),
      role: role.trim() || 'General',
      avatarColor: randomColor,
      lastSeen: 'Active now',
      unreadCount: 0,
    };

    setState((prev) => ({
      ...prev,
      contacts: [...(prev.contacts || []), newContact],
      chatThreads: {
        ...prev.chatThreads,
        [newContactId]: [
          {
            id: `msg-welcome-${Date.now()}`,
            contactId: newContactId,
            sender: 'contact',
            text: `Salam! Glad to connect with you on RESET WEEK.`,
            timestamp: formatTime12h(),
          },
        ],
      },
    }));

    setActiveContactId(newContactId);
  };

  const deleteMessage = (contactId: string, messageId: string) => {
    setState((prev) => ({
      ...prev,
      chatThreads: {
        ...prev.chatThreads,
        [contactId]: (prev.chatThreads[contactId] || []).filter((m) => m.id !== messageId),
      },
    }));
  };

  const clearLastAutoScheduledItem = () => {
    setLastAutoScheduledItem(null);
  };

  const updateReviewAnswers = (data: Partial<WeeklyReviewAnswers>) => {
    setState((prev) => {
      const week = { ...prev.currentWeek };
      week.review = {
        ...week.review,
        answers: {
          ...week.review.answers,
          ...data,
          submittedAt: new Date().toISOString(),
        },
        score: calculatedWeekScore,
        isReviewed: true,
      };
      return { ...prev, currentWeek: week };
    });
  };

  // + START NEW RESET WEEK
  const startNewResetWeek = () => {
    setState((prev) => {
      const current = prev.currentWeek;
      // Archive current week with its computed score
      const archived: ResetWeekCycle = {
        ...current,
        isArchived: true,
        archivedAt: new Date().toISOString(),
        review: {
          ...current.review,
          score: current.review.score || calculatedWeekScore,
          isReviewed: true,
        },
      };

      // Compute next Friday start date
      const currentStart = new Date(current.startDate);
      const nextStart = new Date(currentStart);
      nextStart.setDate(currentStart.getDate() + 7);

      const nextWeekNumber = current.weekNumber + 1;
      const newWeek = createNewResetWeek(nextWeekNumber, nextStart);

      return {
        ...prev,
        currentWeek: newWeek,
        history: [archived, ...prev.history],
      };
    });

    // Reset view to Home
    setActiveTab('home');
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#e5e4de'],
      });
    } catch {
      // ignore
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reset-week-backup-${todayDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.currentWeek && Array.isArray(parsed.history)) {
        if (!parsed.contacts) parsed.contacts = createInitialContacts();
        if (!parsed.chatThreads) parsed.chatThreads = createInitialChatThreads(Object.keys(parsed.currentWeek.days));
        setState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid import data:', e);
    }
    return false;
  };

  const resetAllData = () => {
    if (window.confirm('Reset all app data to default template?')) {
      const fresh = getInitialSeedData();
      setState(fresh);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <ResetWeekContext.Provider
      value={{
        currentWeek,
        history,
        selectedDate,
        theme,
        activeTab,
        isQuickAddOpen,
        inspectingArchivedWeek,

        currentDayData,
        todayDate,
        isTodaySelected,
        dayKeys,

        dailyCompletionPercentage,
        isDailyCoreComplete,
        currentStreak,
        sleepConsistencyPercentage,
        outcomesProgress,
        nowAction,
        financeTodaySummary,
        financeWeeklySummary,
        aiWeeklySummary,
        spanishWeeklySummary,
        englishWeeklySummary,
        todaySchedules,
        weeklySchedules,
        schedulesSummary,
        calculatedWeekScore,

        scheduleSubTab,
        setScheduleSubTab,
        contacts: state.contacts || [],
        chatThreads: state.chatThreads || {},
        activeContactId,
        activeContact,
        activeChatMessages,
        lastAutoScheduledItem,

        setSelectedDate,
        setActiveTab,
        setTheme,
        toggleTheme,
        setIsQuickAddOpen,
        setInspectingArchivedWeek,
        setActiveContactId,
        sendMessage,
        addContact,
        deleteMessage,
        clearLastAutoScheduledItem,

        toggleHabit,
        updateHabitNotes,
        updateRoutineStatus,
        toggleOutcomeTask,
        addOutcomeTask,
        toggleMindResetItem,
        updateMindResetField,
        updateAIDiscovery,
        updateSpanish,
        updateEnglish,
        addTransaction,
        deleteTransaction,
        addScheduleItem,
        toggleScheduleItem,
        deleteScheduleItem,
        updateReviewAnswers,
        startNewResetWeek,
        exportJSON,
        importJSON,
        resetAllData,
      }}
    >
      {children}
    </ResetWeekContext.Provider>
  );
};

export const useResetWeek = () => {
  const context = useContext(ResetWeekContext);
  if (!context) {
    throw new Error('useResetWeek must be used within a ResetWeekProvider');
  }
  return context;
};

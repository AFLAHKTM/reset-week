export type HabitKey = 'quran' | 'ai' | 'spanish' | 'english' | 'finance';

export interface HabitItem {
  id: HabitKey;
  label: string;
  sublabel: string;
  completed: boolean;
  notes: string;
  completedAt?: string; // e.g. "07:45 AM"
}

export type RoutineStatus = 'pending' | 'completed' | 'missed' | 'partial';

export interface RoutineItem {
  id: 'tahajjud' | 'wakeUp' | 'sleep';
  time: string;
  title: string;
  iconName: string;
  status: RoutineStatus;
  note?: string;
}

export interface AIFocusComponents {
  discovery: boolean; // Tool Discovery
  testing: boolean;   // Prompt / Workflow Test
  implementation: boolean; // Live Application
  takeaway: boolean;  // Core Lesson Documented
}

export interface AIDiscovery {
  toolOrTopic: string;
  whatIsNew: string;
  whyUseful: string;
  whatCanUseFor: string;
  tested: boolean;
  takeaway: string;
  minutesLogged: number; // e.g. 15
  components: AIFocusComponents;
  completed: boolean;
  updatedAt?: string;
}

export interface SpanishTracker {
  vocabulary: boolean;
  listening: boolean;
  reading: boolean;
  practice: boolean;
  minutesLogged: number; // e.g. 15
  completed: boolean;
}

export interface EnglishFocusComponents {
  reading: boolean;    // Article Reading
  vocabulary: boolean; // Vocabulary Capture
  learned: boolean;    // 1 Thing Learned
  speaking: boolean;   // Pronunciation & Speaking
}

export interface EnglishArticle {
  title: string;
  source: string;
  topic: string;
  learned: string;
  vocabulary: string;
  minutesLogged: number; // e.g. 15
  components: EnglishFocusComponents;
  completed: boolean;
  readAt?: string;
}

export type TransactionType = 'in' | 'out' | 'pending';
export type TransactionCategory = 'Business' | 'Personal' | 'Office' | 'Food' | 'Travel' | 'Other';

export interface TransactionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  time: string;
}

export type ScheduleItemType = 'meeting' | 'schedule' | 'program' | 'visit';

export interface ScheduleItem {
  id: string;
  title: string; // The main heading / subject (e.g. "Hospital Visit", "Meeting with Zack")
  rawText?: string; // Original full message
  person?: string;
  type: ScheduleItemType;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  duration?: string; // e.g. "45 min"
  location?: string; // e.g. "Office", "Google Meet"
  agenda?: string; // from "for"
  notes?: string;
  completed: boolean;
  completedAt?: string;
  sourceChatId?: string;
  sourceMessageId?: string;
}

export interface ChatMessage {
  id: string;
  contactId?: string;
  sender: 'user' | 'assistant' | 'contact';
  text: string;
  timestamp: string; // e.g. "10:15 AM"
  autoScheduleId?: string;
  scheduleDetails?: {
    title: string;
    rawText?: string;
    date: string;
    time: string;
    duration?: string;
    location?: string;
    agenda?: string;
    notes?: string;
    type: ScheduleItemType;
  };
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatarColor?: string;
  isAssistant?: boolean;
  lastSeen?: string;
  unreadCount?: number;
}

export interface DetectedSchedule {
  title: string; // Clean main heading (e.g. "Hospital Visit")
  rawText: string; // Original input message
  person?: string;
  type: ScheduleItemType;
  date: string;
  time: string;
  duration?: string;
  location?: string;
  agenda?: string;
  notes?: string;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  dayName: string; // "Friday", "Saturday", etc.
  dayIndex: number; // 1 to 7 (Friday is 1, Thursday is 7)
  habits: Record<HabitKey, HabitItem>;
  routines: {
    tahajjud: RoutineStatus;
    wakeUp: RoutineStatus;
    sleep: RoutineStatus;
  };
  aiDiscovery: AIDiscovery;
  spanish: SpanishTracker;
  english: EnglishArticle;
  transactions: TransactionEntry[];
  schedules?: ScheduleItem[];
  dailyReflection?: string;
}

export interface OutcomeTask {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface WeeklyOutcomes {
  officeAndElGrafico: {
    title: string;
    description: string;
    tasks: OutcomeTask[];
  };
  personalBrand: {
    title: string;
    description: string;
    tasks: OutcomeTask[];
  };
  personalReset: {
    title: string;
    description: string;
    tasks: OutcomeTask[];
  };
  general: {
    title: string;
    description: string;
    tasks: OutcomeTask[];
  };
  aurad: {
    title: string;
    description: string;
    tasks: OutcomeTask[];
  };
}

export interface MindReset {
  checklist: OutcomeTask[];
  leavingBehind: string;
  wantToRestart: string;
  stopDoing: string;
  mattersMostNow: string;
  completed: boolean;
}

export interface WeeklyReviewAnswers {
  completed: string;
  avoided: string;
  wastedTime: string;
  createdValue: string;
  stop: string;
  continueAction: string;
  nextWeekPriority: string;
  submittedAt?: string;
}

export interface WeekScore {
  quran: number;
  ai: number;
  spanish: number;
  english: number;
  finance: number;
  office: number;
  elGrafico: number;
  personalBrand: number;
  general?: number;
  aurad?: number;
  overall: number;
}

export interface ResetWeekCycle {
  id: string;
  weekNumber: number; // e.g. 1, 2, 3...
  title: string; // e.g. "Week 01"
  startDate: string; // YYYY-MM-DD (Friday)
  endDate: string; // YYYY-MM-DD (Next Friday)
  days: Record<string, DayData>; // key: YYYY-MM-DD
  outcomes: WeeklyOutcomes;
  mindReset: MindReset;
  review: {
    answers: WeeklyReviewAnswers;
    score?: WeekScore;
    isReviewed: boolean;
  };
  isArchived: boolean;
  createdAt: string;
  archivedAt?: string;
}

export type TabType = 'home' | 'week' | 'schedule' | 'learn' | 'finance' | 'review';
export type ScheduleSubTab = 'agenda' | 'chat';

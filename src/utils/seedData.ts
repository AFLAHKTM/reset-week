import type { ResetWeekCycle, DayData, WeeklyOutcomes, MindReset } from '../types';
import { getPreviousOrCurrentFriday, generateCycleDays, formatISODate } from './dateUtils';

export function createDefaultDayData(date: string, dayName: string, dayIndex: number): DayData {
  return {
    date,
    dayName,
    dayIndex,
    habits: {
      quran: {
        id: 'quran',
        label: '1 Juz Quran',
        sublabel: 'Daily recitation & reflection',
        completed: false,
        notes: '',
      },
      ai: {
        id: 'ai',
        label: 'AI Update',
        sublabel: 'Learn & test one breakthrough tool',
        completed: false,
        notes: '',
      },
      spanish: {
        id: 'spanish',
        label: 'Spanish',
        sublabel: '15 minutes daily language acquisition',
        completed: false,
        notes: '',
      },
      english: {
        id: 'english',
        label: 'English Article',
        sublabel: 'Read 1 high-signal article & note vocabulary',
        completed: false,
        notes: '',
      },
      finance: {
        id: 'finance',
        label: 'Transaction Check',
        sublabel: 'Track Money In, Money Out & Balances',
        completed: false,
        notes: '',
      },
    },
    routines: {
      tahajjud: 'pending',
      wakeUp: 'pending',
      sleep: 'pending',
    },
    aiDiscovery: {
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
    },
    spanish: {
      vocabulary: false,
      listening: false,
      reading: false,
      practice: false,
      minutesLogged: 0,
      completed: false,
    },
    english: {
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
    },
    transactions: [],
    dailyReflection: '',
  };
}

export function createInitialOutcomes(): WeeklyOutcomes {
  return {
    officeAndElGrafico: {
      title: '🏢 OFFICE + EL GRAFICO PROTOTYPE',
      description: 'Physical workspace excellence & business prototype architecture',
      tasks: [
        { id: 'off-1', text: 'Clean office', completed: true, completedAt: 'Fri' },
        { id: 'off-2', text: 'Organize workspace', completed: true, completedAt: 'Fri' },
        { id: 'off-3', text: 'Arrange desks/equipment', completed: true, completedAt: 'Sat' },
        { id: 'off-4', text: 'Organize files', completed: false },
        { id: 'off-5', text: 'Define client workflow', completed: false },
        { id: 'off-6', text: 'Define service workflow', completed: false },
        { id: 'off-7', text: 'Create El Grafico prototype', completed: false },
      ],
    },
    personalBrand: {
      title: '👤 PERSONAL BRAND — JUST START',
      description: 'Overcome friction, establish positioning, publish authentic content',
      tasks: [
        { id: 'pb-1', text: 'Define positioning', completed: true, completedAt: 'Fri' },
        { id: 'pb-2', text: 'Update profile', completed: true, completedAt: 'Sat' },
        { id: 'pb-3', text: 'Define content pillars', completed: true, completedAt: 'Sun' },
        { id: 'pb-4', text: 'Generate 3 content ideas', completed: false },
        { id: 'pb-5', text: 'Create first post', completed: false },
        { id: 'pb-6', text: 'Publish first post', completed: false },
      ],
    },
    personalReset: {
      title: '🧠 PERSONAL RESET',
      description: 'Discipline baseline, spiritual grounding & cognitive clarity',
      tasks: [
        { id: 'pr-1', text: 'Establish sleep routine', completed: true, completedAt: 'Sat' },
        { id: 'pr-2', text: 'Complete daily Quran', completed: true, completedAt: 'Sun' },
        { id: 'pr-3', text: 'Complete learning routine', completed: false },
        { id: 'pr-4', text: 'Reduce unnecessary screen time', completed: true, completedAt: 'Sun' },
      ],
    },
    general: {
      title: '🛒 GENERAL & COMMUNITY',
      description: 'Errands, shopping, home visits, meeting persons & attending programs',
      tasks: [
        { id: 'gen-1', text: 'Shopping (Groceries & essentials)', completed: true, completedAt: 'Fri' },
        { id: 'gen-2', text: 'Home visit (Family & relatives)', completed: true, completedAt: 'Sat' },
        { id: 'gen-3', text: 'Meet / show key persons', completed: false },
        { id: 'gen-4', text: 'Attend scheduled programs & events', completed: false },
      ],
    },
    aurad: {
      title: '📿 AURAD & SPIRITUAL RECITATIONS',
      description: 'Litanies & Surahs: Ratib Al-Haddad, Yaseen, Al-Fath, Al-Waqiah & Al-Mulk',
      tasks: [
        { id: 'aur-1', text: 'Ratib Al-Haddad', completed: true, completedAt: 'Fri' },
        { id: 'aur-2', text: 'Surah Yaseen', completed: true, completedAt: 'Sat' },
        { id: 'aur-3', text: 'Surat Al-Fath', completed: false },
        { id: 'aur-4', text: 'Surah Al-Waqi\'ah', completed: false },
        { id: 'aur-5', text: 'Surah Al-Mulk', completed: false },
        { id: 'aur-6', text: 'Surah Al-Kahf (Friday)', completed: true, completedAt: 'Fri' },
      ],
    },
  };
}

export function createInitialMindReset(): MindReset {
  return {
    checklist: [
      { id: 'mr-1', text: 'Choose destination', completed: false },
      { id: 'mr-2', text: 'Plan budget', completed: false },
      { id: 'mr-3', text: 'Travel', completed: false },
      { id: 'mr-4', text: 'Disconnect from unnecessary social media', completed: false },
      { id: 'mr-5', text: 'Reflect', completed: false },
      { id: 'mr-6', text: 'Write next priorities', completed: false },
    ],
    leavingBehind: 'Mental clutter, over-thinking minor decisions, and screen fatigue.',
    wantToRestart: 'Daily deep work blocks with pure focus before noon.',
    stopDoing: 'Checking notifications first thing after waking up.',
    mattersMostNow: 'Launching the El Grafico service workflow and consistent Quran discipline.',
    completed: false,
  };
}

export function createNewResetWeek(weekNumber: number, startDateInput?: Date): ResetWeekCycle {
  const startFriday = startDateInput ? new Date(startDateInput) : getPreviousOrCurrentFriday();
  const nextFriday = new Date(startFriday);
  nextFriday.setDate(startFriday.getDate() + 7);

  const cycleDays = generateCycleDays(startFriday);
  const days: Record<string, DayData> = {};

  cycleDays.forEach((cd) => {
    days[cd.date] = createDefaultDayData(cd.date, cd.dayName, cd.dayIndex);
  });

  return {
    id: `cycle-${weekNumber}-${formatISODate(startFriday)}`,
    weekNumber,
    title: `Week ${String(weekNumber).padStart(2, '0')}`,
    startDate: formatISODate(startFriday),
    endDate: formatISODate(nextFriday),
    days,
    outcomes: createInitialOutcomes(),
    mindReset: createInitialMindReset(),
    review: {
      answers: {
        completed: '',
        avoided: '',
        wastedTime: '',
        createdValue: '',
        stop: '',
        continueAction: '',
        nextWeekPriority: '',
      },
      isReviewed: false,
    },
    isArchived: false,
    createdAt: new Date().toISOString(),
  };
}

export function getInitialSeedData(): {
  currentWeek: ResetWeekCycle;
  history: ResetWeekCycle[];
} {
  const currentWeek = createNewResetWeek(3);

  // Populate some realistic progress into the current week (Week 03) so it feels alive
  const dates = Object.keys(currentWeek.days);
  const todayStr = formatISODate(new Date());

  // If today is in current week's dates, populate today with active items
  if (dates.length > 0) {
    const day1Key = dates[0]; // Friday
    const day2Key = dates[1]; // Saturday
    const currentDayKey = dates.includes(todayStr) ? todayStr : dates[2];

    if (currentWeek.days[day1Key]) {
      const d1 = currentWeek.days[day1Key];
      d1.habits.quran.completed = true;
      d1.habits.quran.completedAt = '06:15 AM';
      d1.habits.ai.completed = true;
      d1.habits.ai.completedAt = '10:30 AM';
      d1.habits.spanish.completed = true;
      d1.habits.spanish.completedAt = '04:15 PM';
      d1.habits.english.completed = true;
      d1.habits.english.completedAt = '05:00 PM';
      d1.habits.finance.completed = true;
      d1.habits.finance.completedAt = '09:20 PM';

      d1.routines.tahajjud = 'completed';
      d1.routines.wakeUp = 'completed';
      d1.routines.sleep = 'completed';

      d1.aiDiscovery = {
        toolOrTopic: 'Claude 3.7 Sonnet Hybrid Reasoning',
        whatIsNew: 'Unified standard fast mode and extended thinking mode in a single endpoint.',
        whyUseful: 'Allows adjusting thinking token budgets dynamically for complex design tasks.',
        whatCanUseFor: 'Drafting service workflows for El Grafico clients.',
        tested: true,
        takeaway: 'Hybrid reasoning simplifies building agentic pipelines without multiple models.',
        minutesLogged: 20,
        components: {
          discovery: true,
          testing: true,
          implementation: true,
          takeaway: true,
        },
        completed: true,
      };

      d1.spanish = {
        vocabulary: true,
        listening: true,
        reading: true,
        practice: true,
        minutesLogged: 20,
        completed: true,
      };

      d1.english = {
        title: 'Systems Over Goals: Operating with Consistency',
        source: 'Farnam Street',
        topic: 'Mental Models & Productivity',
        learned: 'Focusing on the trajectory and daily environment design produces 10x better returns than obsessing on targets.',
        vocabulary: 'Ineffable, Ergonomic friction, Compounding momentum',
        minutesLogged: 25,
        components: {
          reading: true,
          vocabulary: true,
          learned: true,
          speaking: false,
        },
        completed: true,
      };

      d1.transactions = [
        { id: 'tx-1', date: day1Key, type: 'in', amount: 45000, category: 'Business', description: 'El Grafico branding deposit', time: '11:30 AM' },
        { id: 'tx-2', date: day1Key, type: 'out', amount: 3200, category: 'Office', description: 'Desk cable management & organizers', time: '02:15 PM' },
        { id: 'tx-3', date: day1Key, type: 'out', amount: 850, category: 'Food', description: 'Healthy lunch meal', time: '01:00 PM' },
      ];
    }

    if (currentWeek.days[day2Key]) {
      const d2 = currentWeek.days[day2Key];
      d2.habits.quran.completed = true;
      d2.habits.quran.completedAt = '06:00 AM';
      d2.habits.spanish.completed = true;
      d2.habits.spanish.completedAt = '03:45 PM';
      d2.routines.tahajjud = 'completed';
      d2.routines.wakeUp = 'completed';
      d2.routines.sleep = 'partial';
      d2.transactions = [
        { id: 'tx-4', date: day2Key, type: 'out', amount: 1500, category: 'Personal', description: 'Books and stationery', time: '05:30 PM' },
        { id: 'tx-5', date: day2Key, type: 'pending', amount: 12000, category: 'Business', description: 'Invoice sent to design client', time: '06:00 PM' },
      ];
    }

    // Today's entry
    if (currentWeek.days[currentDayKey] && currentDayKey !== day1Key && currentDayKey !== day2Key) {
      const cd = currentWeek.days[currentDayKey];
      cd.habits.quran.completed = true;
      cd.habits.quran.completedAt = '06:10 AM';
      cd.routines.tahajjud = 'completed';
      cd.routines.wakeUp = 'completed';
      cd.routines.sleep = 'pending';
      cd.transactions = [
        { id: 'tx-6', date: currentDayKey, type: 'in', amount: 18000, category: 'Business', description: 'Consulting milestone payment', time: '10:00 AM' },
        { id: 'tx-7', date: currentDayKey, type: 'out', amount: 450, category: 'Food', description: 'Coffee & light breakfast', time: '08:30 AM' },
      ];
    }
  }

  // Historical weeks (Week 01 - 72%, Week 02 - 81%)
  const history: ResetWeekCycle[] = [
    {
      id: 'cycle-1-archived',
      weekNumber: 1,
      title: 'Week 01',
      startDate: '2026-09-12',
      endDate: '2026-09-19',
      days: {},
      outcomes: createInitialOutcomes(),
      mindReset: createInitialMindReset(),
      review: {
        answers: {
          completed: 'Set up physical desks and established early wake up routine for 5 consecutive days.',
          avoided: 'Cold outreach to potential design clients.',
          wastedTime: 'Overthinking logo variants before talking to real clients.',
          createdValue: 'Consistent morning Quran recitation set an unshakable calm tone for each morning.',
          stop: 'Browsing Twitter/X past 10 PM.',
          continueAction: '15 min daily Spanish session right after lunch.',
          nextWeekPriority: 'Lock in El Grafico service packaging and draft first client contract template.',
          submittedAt: '2026-09-18T20:30:00Z',
        },
        score: {
          quran: 86,
          ai: 71,
          spanish: 86,
          english: 71,
          finance: 71,
          office: 85,
          elGrafico: 55,
          personalBrand: 50,
          overall: 72,
        },
        isReviewed: true,
      },
      isArchived: true,
      createdAt: '2026-09-12T00:00:00Z',
      archivedAt: '2026-09-19T00:00:00Z',
    },
    {
      id: 'cycle-2-archived',
      weekNumber: 2,
      title: 'Week 02',
      startDate: '2026-09-19',
      endDate: '2026-09-26',
      days: {},
      outcomes: createInitialOutcomes(),
      mindReset: createInitialMindReset(),
      review: {
        answers: {
          completed: 'Cleaned and wired the office setup, read 6 articles in English, and finished all 7 Juz of Quran.',
          avoided: 'Publishing the personal brand intro post.',
          wastedTime: 'Tinkering with custom notion dashboards instead of executing.',
          createdValue: 'Maintained positive cash flow check-in every evening without missing a day.',
          stop: 'Late caffeine consumption after 4 PM.',
          continueAction: 'Tahajjud at 3:30 AM followed by Fajr and Quran.',
          nextWeekPriority: 'Deliver first client proposal and launch first post.',
          submittedAt: '2026-09-25T21:15:00Z',
        },
        score: {
          quran: 100,
          ai: 86,
          spanish: 86,
          english: 86,
          finance: 100,
          office: 90,
          elGrafico: 70,
          personalBrand: 60,
          overall: 81,
        },
        isReviewed: true,
      },
      isArchived: true,
      createdAt: '2026-09-19T00:00:00Z',
      archivedAt: '2026-09-26T00:00:00Z',
    },
  ];

  return { currentWeek, history };
}

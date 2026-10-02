import type { ResetWeekCycle, DayData, WeeklyOutcomes, MindReset, ChatContact, ChatMessage } from '../types';
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
    schedules: [],
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
  chatMessages: ChatMessage[];
  contacts?: ChatContact[];
  chatThreads?: Record<string, ChatMessage[]>;
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

      d1.schedules = [
        {
          id: 'sch-1',
          title: "Jumu'ah Prayer & Community Program",
          person: 'Community',
          type: 'program',
          date: day1Key,
          time: '12:45 PM',
          duration: '60 min',
          location: 'Central Mosque',
          notes: 'Early arrival for Surah Kahf and reflection.',
          completed: true,
          completedAt: '01:50 PM',
        },
        {
          id: 'sch-2',
          title: 'Family & Parents Home Visit',
          person: 'Family & Parents',
          type: 'visit',
          date: day1Key,
          time: '04:30 PM',
          duration: '90 min',
          location: 'Home',
          notes: 'Catch up, tea, and family bonding.',
          completed: true,
          completedAt: '06:15 PM',
        },
        {
          id: 'sch-3',
          title: 'Ratib Al-Haddad Weekly Circle',
          person: 'Study Circle',
          type: 'program',
          date: day1Key,
          time: '08:00 PM',
          duration: '45 min',
          location: 'Community Hall',
          notes: 'Spiritual litany and dhikr recitation.',
          completed: true,
          completedAt: '08:50 PM',
        },
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
      d2.schedules = [
        {
          id: 'sch-4',
          title: 'El Grafico Prototype Review & Task Sync',
          person: 'Faisal (Lead Designer)',
          type: 'meeting',
          date: day2Key,
          time: '10:30 AM',
          duration: '45 min',
          location: 'Office Studio',
          notes: 'Review client workflow templates and branding assets.',
          completed: true,
          completedAt: '11:20 AM',
        },
        {
          id: 'sch-5',
          title: 'Workspace Desk & Equipment Shopping',
          person: 'Myself',
          type: 'schedule',
          date: day2Key,
          time: '03:00 PM',
          duration: '90 min',
          location: 'City Mart',
          notes: 'Cable organizers, desk lamp, and stationery.',
          completed: true,
          completedAt: '04:40 PM',
        },
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
      cd.schedules = [
        {
          id: 'sch-6',
          title: 'Client Discovery Call — New Brand Project',
          person: 'Omar (Retail Co)',
          type: 'meeting',
          date: currentDayKey,
          time: '11:00 AM',
          duration: '30 min',
          location: 'Google Meet',
          notes: 'Discuss scope, deliverables, and service proposal.',
          completed: false,
        },
        {
          id: 'sch-7',
          title: 'Evening Program & Halaqah',
          person: 'Youth Circle',
          type: 'program',
          date: currentDayKey,
          time: '07:30 PM',
          duration: '60 min',
          location: 'Learning Center',
          notes: 'Topic: Consistency in personal habits.',
          completed: false,
        },
        {
          id: 'sch-8',
          title: 'Mentor Catch-up & Advice',
          person: 'Ustadh Tariq',
          type: 'meeting',
          date: currentDayKey,
          time: '09:00 PM',
          duration: '40 min',
          location: 'Call / Coffee',
          notes: 'Reviewing reset week trajectory and business milestones.',
          completed: false,
        },
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

  const chatMessages = createInitialChatMessages(Object.keys(currentWeek.days));
  const contacts = createInitialContacts();
  const chatThreads = createInitialChatThreads(Object.keys(currentWeek.days));

  return { currentWeek, history, chatMessages, contacts, chatThreads };
}

export function createInitialChatMessages(weekDates: string[] = []): ChatMessage[] {
  const d2 = weekDates[1] || '2026-10-03';
  return [
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: "Salam! I am your Schedule Chatbot.\n\nType commitments using natural syntax:\n• 'on' → time (e.g. on 11:30 AM, on tomorrow 4 PM)\n• 'at' or '@' → location (e.g. at Google Meet, @ Office)\n• 'duration' → duration (e.g. duration 45m, duration 1 hr)\n• 'for' → agenda and notes (e.g. for UI Design review)\n\nI will schedule it to your agenda exactly as typed!",
      timestamp: '09:00 AM',
    },
    {
      id: 'msg-init-2',
      sender: 'user',
      text: 'Meeting with Zack on tomorrow 11:30 AM at Google Meet duration 45 min for UI Design review',
      timestamp: '09:15 AM',
      autoScheduleId: 'sch-1',
      scheduleDetails: {
        title: 'Meeting with Zack',
        rawText: 'Meeting with Zack on tomorrow 11:30 AM at Google Meet duration 45 min for UI Design review',
        date: d2,
        time: '11:30 AM',
        duration: '45 min',
        location: 'Google Meet',
        agenda: 'UI Design review',
        notes: 'UI Design review',
        type: 'meeting',
      },
    },
    {
      id: 'msg-init-3',
      sender: 'assistant',
      text: `✅ Scheduled: Meeting with Zack\n\n📌 Event: "Meeting with Zack"\n🗓️ Date: ${d2}\n⏰ Time: 11:30 AM\n📍 Location: Google Meet\n⏱️ Duration: 45 min\n📝 Agenda / Notes: UI Design review\n\nAdded to your Agenda.`,
      timestamp: '09:15 AM',
    },
  ];
}

export function createInitialContacts(): ChatContact[] {
  return [
    {
      id: 'contact-zack',
      name: 'Zack',
      role: 'El Grafico Partner',
      avatarColor: 'bg-emerald-600',
      lastSeen: 'Active now',
      unreadCount: 0,
    },
    {
      id: 'contact-hamdan',
      name: 'Hamdan',
      role: 'Personal Brand & Media',
      avatarColor: 'bg-indigo-600',
      lastSeen: '10m ago',
      unreadCount: 0,
    },
    {
      id: 'contact-dr-rashid',
      name: 'Dr. Rashid',
      role: 'Mentor & Advisory',
      avatarColor: 'bg-amber-600',
      lastSeen: '1h ago',
      unreadCount: 0,
    },
    {
      id: 'contact-assistant',
      name: 'AI Scheduling Assistant',
      role: 'Smart Auto-Scheduler',
      avatarColor: 'bg-purple-600',
      isAssistant: true,
      lastSeen: 'Online',
      unreadCount: 0,
    },
    {
      id: 'contact-family',
      name: 'Family & Home',
      role: 'Home Visits & Programs',
      avatarColor: 'bg-rose-600',
      lastSeen: 'Yesterday',
      unreadCount: 0,
    },
  ];
}

export function createInitialChatThreads(weekDates: string[] = []): Record<string, ChatMessage[]> {
  const d2 = weekDates[1] || '2026-10-03';
  const d3 = weekDates[2] || '2026-10-04';

  return {
    'contact-zack': [
      {
        id: 'msg-z1',
        contactId: 'contact-zack',
        sender: 'contact',
        text: 'Assalamu alaikum Aflah! Have you reviewed the client branding package for El Grafico?',
        timestamp: '09:15 AM',
      },
      {
        id: 'msg-z2',
        contactId: 'contact-zack',
        sender: 'user',
        text: 'Wa alaikum assalam Zack! Yes, the typography and identity direction look solid.',
        timestamp: '09:20 AM',
      },
      {
        id: 'msg-z3',
        contactId: 'contact-zack',
        sender: 'contact',
        text: 'Can we do a call on Saturday at 11:30 AM to finalize the logo concepts on Google Meet?',
        timestamp: '09:22 AM',
        autoScheduleId: 'sch-1',
        scheduleDetails: {
          title: 'El Grafico Logo Review with Zack',
          date: d2,
          time: '11:30 AM',
          duration: '45 min',
          location: 'Google Meet',
          type: 'meeting',
        },
      },
      {
        id: 'msg-z4',
        contactId: 'contact-zack',
        sender: 'user',
        text: "Perfect, let's meet Saturday 11:30 AM on Google Meet. Added to schedule!",
        timestamp: '09:25 AM',
      },
    ],
    'contact-hamdan': [
      {
        id: 'msg-h1',
        contactId: 'contact-hamdan',
        sender: 'contact',
        text: 'Hey brother, the outline for the AI workflow video is prepared.',
        timestamp: 'Yesterday',
      },
      {
        id: 'msg-h2',
        contactId: 'contact-hamdan',
        sender: 'user',
        text: "Great! Let's schedule a 30 min sync on Saturday at 3:00 PM at Office to record.",
        timestamp: 'Yesterday',
        autoScheduleId: 'sch-2',
        scheduleDetails: {
          title: 'Brand Video Recording with Hamdan',
          date: d2,
          time: '03:00 PM',
          duration: '30 min',
          location: 'Office',
          type: 'meeting',
        },
      },
    ],
    'contact-dr-rashid': [
      {
        id: 'msg-r1',
        contactId: 'contact-dr-rashid',
        sender: 'contact',
        text: 'Hope the reset week is going strong. When are you free for our weekly advisory catch-up?',
        timestamp: 'Thursday',
      },
      {
        id: 'msg-r2',
        contactId: 'contact-dr-rashid',
        sender: 'user',
        text: "Alhamdulillah doing well Dr. Rashid! Let's meet Sunday at 5:00 PM for 45 min.",
        timestamp: 'Thursday',
        autoScheduleId: 'sch-rashid-1',
        scheduleDetails: {
          title: 'Weekly Advisory Catch-up with Dr. Rashid',
          date: d3,
          time: '05:00 PM',
          duration: '45 min',
          type: 'meeting',
        },
      },
    ],
    'contact-assistant': [
      {
        id: 'msg-a1',
        contactId: 'contact-assistant',
        sender: 'assistant',
        text: "Salam! I am your AI Scheduling Assistant.\n\nType any plan, meeting, or appointment in natural language (for example: \"Schedule client call tomorrow at 10 AM on Zoom\" or \"Home visit Sunday at 7 PM\") and I will automatically schedule it for you!",
        timestamp: 'Just now',
      },
    ],
    'contact-family': [
      {
        id: 'msg-f1',
        contactId: 'contact-family',
        sender: 'contact',
        text: 'Are you visiting home this weekend?',
        timestamp: 'Wednesday',
      },
      {
        id: 'msg-f2',
        contactId: 'contact-family',
        sender: 'user',
        text: "Insha'Allah! Let's schedule a home visit on Sunday at 7:00 PM.",
        timestamp: 'Wednesday',
        autoScheduleId: 'sch-fam-1',
        scheduleDetails: {
          title: 'Home Visit (Family)',
          date: d3,
          time: '07:00 PM',
          duration: '1 hour',
          location: 'Home',
          type: 'visit',
        },
      },
    ],
  };
}

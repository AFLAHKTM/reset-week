import React from 'react';
import { ResetWeekProvider, useResetWeek } from './context/ResetWeekContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { QuickAddModal } from './components/QuickAddModal';
import { ArchivedWeekModal } from './components/ArchivedWeekModal';
import { HomeView } from './views/HomeView';
import { WeekView } from './views/WeekView';
import { ScheduleView } from './views/ScheduleView';
import { MessagesView } from './views/MessagesView';
import { LearnView } from './views/LearnView';
import { FinanceView } from './views/FinanceView';
import { ReviewView } from './views/ReviewView';

const AppContent: React.FC = () => {
  const { activeTab } = useResetWeek();

  return (
    <div className="min-h-screen bg-obsidian-950 text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Top Header */}
      <Header />

      {/* Main Mobile App Container */}
      <main className="flex-1 max-w-md md:max-w-3xl w-full mx-auto px-3.5 sm:px-6 pt-3.5 pb-28">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'week' && <WeekView />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'chat' && <MessagesView />}
        {activeTab === 'learn' && <LearnView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'review' && <ReviewView />}
      </main>

      {/* Bottom Navigation Dock */}
      <Navigation />

      {/* Quick Add Floating Bottom Sheet */}
      <QuickAddModal />

      {/* Archived Historical Week Bottom Sheet */}
      <ArchivedWeekModal />
    </div>
  );
};

export default function App() {
  return (
    <ResetWeekProvider>
      <AppContent />
    </ResetWeekProvider>
  );
}

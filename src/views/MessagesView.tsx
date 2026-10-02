import React, { useState, useRef, useEffect } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { ScheduleItemType } from '../types';
import {
  Send,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Bot,
  User,
  ArrowRight,
  X,
  RotateCcw,
  Check,
  FileText,
  Timer,
} from 'lucide-react';
import { extractMainHeading } from '../utils/chatParser';

export const MessagesView: React.FC<{ embedded?: boolean }> = () => {
  const {
    chatMessages,
    sendChatMessage,
    clearChat,
    lastAutoScheduledItem,
    clearLastAutoScheduledItem,
    setSelectedDate,
    setScheduleSubTab,
  } = useResetWeek();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleJumpToSchedule = (dateStr: string) => {
    if (dateStr) setSelectedDate(dateStr);
    setScheduleSubTab('agenda');
  };

  const quickPrompts = [
    `Meeting with Zack on tomorrow 11:30 AM at Google Meet duration 45 min for UI Design review`,
    `Coffee with Hamdan on Sunday 4 PM @ Starbucks duration 1 hour for partnership discussion`,
    `Doctor appointment on Monday 5:00 PM at City Clinic for eye checkup duration 30m`,
    `Shopping on Saturday at Lulu Mall for weekly groceries duration 2 hours`,
    `Aurad gathering on Friday 8 PM at Masjid for Surat Al Fath`,
  ];

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
    <div className="space-y-3.5 pb-16 animate-in fade-in duration-200">
      {/* 1. Chatbot Header */}
      <div className="flex items-center justify-between p-3 bg-neutral-900/70 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Schedule Chatbot
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-neutral-400">
              Schedules commitments <span className="text-emerald-400 font-medium">exactly as typed</span>
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg text-xs flex items-center gap-1 transition-colors"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="text-[10px] hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* 2. Auto-Scheduled Celebration Toast */}
      {lastAutoScheduledItem && (
        <div className="p-3 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-obsidian-900 border border-emerald-500/40 rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/40 text-emerald-300 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                  Scheduled in Agenda
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">
                  "{extractMainHeading(lastAutoScheduledItem.title, lastAutoScheduledItem.type)}"
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-300">
                  <span className="flex items-center gap-1 font-mono text-emerald-300">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {lastAutoScheduledItem.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {lastAutoScheduledItem.time}
                  </span>
                  {lastAutoScheduledItem.location && (
                    <span className="flex items-center gap-1 text-neutral-300">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {lastAutoScheduledItem.location}
                    </span>
                  )}
                  {lastAutoScheduledItem.duration && (
                    <span className="flex items-center gap-1 text-amber-300 font-mono">
                      <Timer className="w-3 h-3 text-amber-400" />
                      {lastAutoScheduledItem.duration}
                    </span>
                  )}
                </div>
                {(lastAutoScheduledItem.agenda || (lastAutoScheduledItem.notes && lastAutoScheduledItem.notes !== 'Scheduled via Chatbot')) && (
                  <div className="mt-1 text-[11px] text-neutral-300 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="truncate">
                      <span className="text-neutral-400 font-medium">Agenda:</span>{' '}
                      {lastAutoScheduledItem.agenda || lastAutoScheduledItem.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleJumpToSchedule(lastAutoScheduledItem.date)}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-[11px] rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={clearLastAutoScheduledItem}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Chat Window */}
      <div className="bg-obsidian-900 border border-neutral-800/80 rounded-2xl flex flex-col h-[480px] sm:h-[540px] shadow-card overflow-hidden">
        {/* Message Stream */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-obsidian-950/60">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <Bot className="w-8 h-8 text-neutral-600 stroke-[1.5]" />
              <p className="text-xs text-neutral-300 font-medium">Single Schedule Chatbot</p>
              <p className="text-[11px] text-neutral-500 max-w-xs">
                Type any meeting or schedule (e.g. "Meeting with Zack tomorrow at 11:30 AM") and it will be added to your agenda exactly as typed.
              </p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-150`}
                >
                  <div className="flex items-end gap-1.5 max-w-[90%] sm:max-w-[82%]">
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mb-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm font-normal'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-bl-xs shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {isUser && (
                      <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300 shrink-0 mb-0.5">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Embedded Auto-Scheduled Event Card */}
                  {msg.scheduleDetails && (
                    <div className="ml-7 mr-7 max-w-[90%] sm:max-w-[82%] w-full bg-gradient-to-br from-emerald-950/70 to-obsidian-900 border border-emerald-500/40 rounded-xl p-3 shadow-md animate-in slide-in-from-bottom-1 duration-200">
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="flex items-center gap-1 text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-400">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                          Scheduled in Agenda
                        </span>
                        {(() => {
                          const badge = getTypeBadge(msg.scheduleDetails.type);
                          return (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-medium border flex items-center gap-1 ${badge.color}`}
                            >
                              <span>{badge.icon}</span>
                              <span>{badge.label}</span>
                            </span>
                          );
                        })()}
                      </div>

                      <h4 className="text-xs font-semibold text-white break-words">
                        "{extractMainHeading(msg.scheduleDetails.title, msg.scheduleDetails.type)}"
                      </h4>

                      <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px] text-neutral-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="font-mono text-neutral-200 truncate">
                            {msg.scheduleDetails.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="font-mono text-neutral-200 truncate">
                            {msg.scheduleDetails.time}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                        {msg.scheduleDetails.location && (
                          <div className="flex items-center gap-1 text-indigo-300 font-mono">
                            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="truncate">{msg.scheduleDetails.location}</span>
                          </div>
                        )}
                        {msg.scheduleDetails.duration && (
                          <div className="flex items-center gap-1 text-amber-300 font-mono">
                            <Timer className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{msg.scheduleDetails.duration}</span>
                          </div>
                        )}
                      </div>

                      {(msg.scheduleDetails.agenda || (msg.scheduleDetails.notes && msg.scheduleDetails.notes !== 'Scheduled via Chatbot')) && (
                        <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-neutral-300 bg-neutral-900/80 p-2 rounded-lg border border-neutral-800/60">
                          <FileText className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono uppercase text-purple-300 block font-semibold">
                              Agenda / Notes
                            </span>
                            <span className="break-words text-neutral-200">
                              {msg.scheduleDetails.agenda || msg.scheduleDetails.notes}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-emerald-900/40 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400">
                          Added to calendar
                        </span>
                        <button
                          onClick={() => handleJumpToSchedule(msg.scheduleDetails!.date)}
                          className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-semibold flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <span>View in Agenda</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[9px] font-mono text-neutral-500 px-7">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-neutral-950/90 border-t border-neutral-800/60 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase text-neutral-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            Quick:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(prompt)}
              className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-800 shrink-0 transition-all active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="p-2.5 sm:p-3 bg-neutral-950 border-t border-neutral-800/80 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type to schedule (e.g. 'Meeting with Zack on tomorrow 11:30 AM at Google Meet duration 45m for UI Review')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-obsidian-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 sm:px-3.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
            title="Schedule Now"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schedule</span>
          </button>
        </form>
      </div>
    </div>
  );
};

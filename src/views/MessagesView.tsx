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
  UserPlus,
  MessageSquare,
  Check,
} from 'lucide-react';

export const MessagesView: React.FC<{ embedded?: boolean }> = ({ embedded = true }) => {
  const {
    contacts,
    activeContactId,
    setActiveContactId,
    activeContact,
    activeChatMessages,
    sendMessage,
    addContact,
    lastAutoScheduledItem,
    clearLastAutoScheduledItem,
    setSelectedDate,
    setActiveTab,
    setScheduleSubTab,
  } = useResetWeek();

  const [inputText, setInputText] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeContactId, inputText.trim());
    setInputText('');
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    addContact(newContactName.trim(), newContactRole.trim() || 'General');
    setNewContactName('');
    setNewContactRole('');
    setShowAddContact(false);
  };

  const handleJumpToSchedule = (dateStr: string) => {
    if (dateStr) setSelectedDate(dateStr);
    setScheduleSubTab('agenda');
    setActiveTab('schedule');
  };

  const quickPrompts = [
    `Let's meet tomorrow at 11:30 AM on Google Meet`,
    `Can we do a 30-min call Saturday at 4:00 PM at Office?`,
    `Schedule home visit on Sunday at 7:00 PM`,
    `Review El Grafico branding Friday at 10 AM`,
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
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Header */}
      {embedded ? (
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Auto-Schedule Chat
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              Chats automatically add meetings to agenda
            </span>
          </div>

          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80 active:scale-95 transition-all shadow-sm"
            title="Add New Contact"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Contact</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Smart Auto-Scheduler
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              MESSAGES & CHAT
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
              Conversations automatically detect & add meetings to your schedule
            </p>
          </div>

          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80 active:scale-95 transition-all shadow-sm"
            title="Add New Contact"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">New Contact</span>
          </button>
        </div>
      )}

      {/* 2. Auto-Scheduled Celebration Banner (Toast) */}
      {lastAutoScheduledItem && (
        <div className="p-3 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-obsidian-900 border border-emerald-500/40 rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/40 text-emerald-300 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Schedule Created Automatically!
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                    Live
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                  {lastAutoScheduledItem.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-300">
                  <span className="flex items-center gap-1 font-mono text-emerald-300">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {lastAutoScheduledItem.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {lastAutoScheduledItem.time} ({lastAutoScheduledItem.duration || '45 min'})
                  </span>
                  {lastAutoScheduledItem.location && (
                    <span className="flex items-center gap-1 text-neutral-300">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {lastAutoScheduledItem.location}
                    </span>
                  )}
                </div>
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
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Contact Drawer */}
      {showAddContact && (
        <form
          onSubmit={handleAddContactSubmit}
          className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              Add New Contact
            </span>
            <button
              type="button"
              onClick={() => setShowAddContact(false)}
              className="text-neutral-500 hover:text-neutral-300 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-mono text-neutral-400">Name</label>
              <input
                type="text"
                placeholder="e.g. Omar Khalid"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-neutral-400">Role / Tag</label>
              <input
                type="text"
                placeholder="e.g. El Grafico Client, Brand Partner"
                value={newContactRole}
                onChange={(e) => setNewContactRole(e.target.value)}
                className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddContact(false)}
              className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newContactName.trim()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* 4. Horizontal Contacts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-0.5">
        {contacts.map((contact) => {
          const isActive = contact.id === activeContactId;
          return (
            <button
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left shrink-0 transition-all active:scale-95 ${
                isActive
                  ? 'bg-neutral-800/90 text-white border-emerald-500/60 shadow-sm'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800/80 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                  contact.avatarColor || 'bg-emerald-600'
                }`}
              >
                {contact.isAssistant ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  contact.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold truncate max-w-[100px] sm:max-w-[120px]">
                    {contact.name}
                  </span>
                  {contact.isAssistant && (
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 truncate max-w-[100px] sm:max-w-[120px]">
                  {contact.role}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 5. Chat Window */}
      <div className="bg-obsidian-900 border border-neutral-800/80 rounded-2xl flex flex-col h-[520px] sm:h-[580px] shadow-card overflow-hidden">
        {/* Thread Header */}
        <div className="p-3 sm:px-4 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0 ${
                activeContact?.avatarColor || 'bg-emerald-600'
              }`}
            >
              {activeContact?.isAssistant ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                activeContact?.name?.charAt(0).toUpperCase() || 'C'
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">
                  {activeContact?.name || 'Contact'}
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400">
                {activeContact?.role} •{' '}
                <span className="text-emerald-400 font-mono">Auto-Schedule ON</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleJumpToSchedule(lastAutoScheduledItem?.date || '')}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 text-neutral-300 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 transition-colors"
            title="Open Schedule Hub"
          >
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-obsidian-950/60">
          {activeChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <MessageSquare className="w-8 h-8 text-neutral-600 stroke-[1.5]" />
              <p className="text-xs text-neutral-400">No messages in this conversation yet.</p>
              <p className="text-[11px] text-neutral-400">
                Send a message with a day or time to test automatic scheduling!
              </p>
            </div>
          ) : (
            activeChatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isBot = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-150`}
                >
                  <div className="flex items-end gap-1.5 max-w-[88%] sm:max-w-[80%]">
                    {!isUser && (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mb-0.5 ${
                          isBot
                            ? 'bg-purple-600'
                            : activeContact?.avatarColor || 'bg-emerald-600'
                        }`}
                      >
                        {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3 h-3" />}
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm font-normal'
                          : isBot
                          ? 'bg-purple-950/50 border border-purple-800/40 text-purple-100 rounded-bl-xs'
                          : 'bg-neutral-900 border border-neutral-800/80 text-neutral-100 rounded-bl-xs shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Embedded Auto-Scheduled Event Card */}
                  {msg.scheduleDetails && (
                    <div className="ml-7 mr-1 max-w-[88%] sm:max-w-[80%] w-full bg-gradient-to-br from-emerald-950/70 to-obsidian-900 border border-emerald-500/40 rounded-xl p-3 shadow-md animate-in slide-in-from-bottom-1 duration-200">
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="flex items-center gap-1 text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-400">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                          Auto-Scheduled Event
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

                      <h4 className="text-xs font-semibold text-white">
                        {msg.scheduleDetails.title}
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
                            {msg.scheduleDetails.time}{' '}
                            {msg.scheduleDetails.duration ? `(${msg.scheduleDetails.duration})` : ''}
                          </span>
                        </div>
                      </div>

                      {msg.scheduleDetails.location && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-300 font-mono">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{msg.scheduleDetails.location}</span>
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
                          <span>View in Schedule</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[9px] font-mono text-neutral-400 px-1">
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
            Try:
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
            placeholder={`Message ${activeContact?.name || 'Contact'} (e.g. "Let's meet tomorrow at 10 AM")...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-obsidian-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 sm:px-3.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

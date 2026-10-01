import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { WeeklyOutcomes, TransactionCategory, TransactionType } from '../types';
import { X, CheckSquare, CircleDollarSign, Sparkles, BookOpen, MessageSquarePlus } from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    addOutcomeTask,
    addTransaction,
    updateAIDiscovery,
    updateEnglish,
    updateReviewAnswers,
  } = useResetWeek();

  type QuickTab = 'task' | 'finance' | 'ai' | 'article' | 'reflection';
  const [tab, setTab] = useState<QuickTab>('task');

  // Task form state
  const [taskCategory, setTaskCategory] = useState<keyof WeeklyOutcomes>('officeAndElGrafico');
  const [taskText, setTaskText] = useState('');

  // Finance form state
  const [txType, setTxType] = useState<TransactionType>('out');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState<TransactionCategory>('Food');
  const [txDesc, setTxDesc] = useState('');

  // AI form state
  const [aiTool, setAiTool] = useState('');
  const [aiWhy, setAiWhy] = useState('');
  const [aiTakeaway, setAiTakeaway] = useState('');

  // English form state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSource, setArticleSource] = useState('');
  const [articleLearned, setArticleLearned] = useState('');

  // Reflection form state
  const [quickThought, setQuickThought] = useState('');

  if (!isQuickAddOpen) return null;

  const handleClose = () => {
    setIsQuickAddOpen(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    addOutcomeTask(taskCategory, taskText);
    setTaskText('');
    handleClose();
  };

  const handleFinanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    addTransaction({
      amount: amountNum,
      type: txType,
      category: txCategory,
      description: txDesc || `${txType === 'in' ? 'Income' : 'Expense'} - ${txCategory}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    });
    setTxAmount('');
    setTxDesc('');
    handleClose();
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTool.trim()) return;
    updateAIDiscovery({
      toolOrTopic: aiTool,
      whyUseful: aiWhy,
      takeaway: aiTakeaway,
      tested: true,
    });
    setAiTool('');
    setAiWhy('');
    setAiTakeaway('');
    handleClose();
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;
    updateEnglish({
      title: articleTitle,
      source: articleSource,
      learned: articleLearned,
      completed: true,
    });
    setArticleTitle('');
    setArticleSource('');
    setArticleLearned('');
    handleClose();
  };

  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim()) return;
    updateReviewAnswers({
      createdValue: quickThought,
    });
    setQuickThought('');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-obsidian-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-neutral-100 max-h-[92vh] flex flex-col">
        {/* Mobile Pull Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-neutral-700/80" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 sm:py-4 border-b border-neutral-800/80">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm tracking-tight text-white">Quick Add</span>
            <span className="text-[11px] text-neutral-400 font-mono">Capture Action</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-neutral-800/80 px-2 sm:px-3 bg-obsidian-950/40 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setTab('task')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'task'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>

          <button
            onClick={() => setTab('finance')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'finance'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CircleDollarSign className="w-3.5 h-3.5" />
            <span>Finance</span>
          </button>

          <button
            onClick={() => setTab('ai')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'ai'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Discovery</span>
          </button>

          <button
            onClick={() => setTab('article')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'article'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Article</span>
          </button>

          <button
            onClick={() => setTab('reflection')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'reflection'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Reflection</span>
          </button>
        </div>

        {/* Tab Contents with smooth scrolling */}
        <div className="p-4 sm:p-5 overflow-y-auto pb-safe">
          {tab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1.5">
                  Select Outcome Pillar
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as keyof WeeklyOutcomes)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
                >
                  <option value="officeAndElGrafico">🏢 Office + El Grafico Prototype</option>
                  <option value="personalBrand">👤 Personal Brand — Just Start</option>
                  <option value="personalReset">🧠 Personal Reset</option>
                  <option value="general">🛒 General (Shopping, Home Visits, Programs)</option>
                  <option value="aurad">📿 Aurad (Haddad, Yaseen, Al-Fath)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1.5">
                  Task Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wire cable management setup..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-neutral-200 rounded-xl hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!taskText.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          )}

          {tab === 'finance' && (
            <form onSubmit={handleFinanceSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
                {(['out', 'in', 'pending'] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTxType(t)}
                    className={`py-2 text-xs font-medium rounded-lg capitalize transition-all ${
                      txType === t
                        ? t === 'in'
                          ? 'bg-emerald-600 text-white font-semibold'
                          : t === 'out'
                          ? 'bg-rose-600 text-white font-semibold'
                          : 'bg-amber-600 text-white font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {t === 'in' ? 'Money In' : t === 'out' ? 'Money Out' : 'Pending'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Category
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as TransactionCategory)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
                  >
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                    <option value="Office">Office</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client deposit, groceries, server cost..."
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-neutral-200 rounded-xl hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!txAmount}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Log Transaction
                </button>
              </div>
            </form>
          )}

          {tab === 'ai' && (
            <form onSubmit={handleAiSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Tool / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cursor agentic rules, Whisper V3..."
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Why is it useful?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cuts prototype iteration time in half..."
                  value={aiWhy}
                  onChange={(e) => setAiWhy(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Today's AI Takeaway
                </label>
                <input
                  type="text"
                  placeholder="Core lesson learned today..."
                  value={aiTakeaway}
                  onChange={(e) => setAiTakeaway(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-neutral-200 rounded-xl hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!aiTool.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Save Discovery
                </button>
              </div>
            </form>
          )}

          {tab === 'article' && (
            <form onSubmit={handleArticleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Architecture of High Agency..."
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paul Graham essay"
                    value={articleSource}
                    onChange={(e) => setArticleSource(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    1 Thing I Learned
                  </label>
                  <input
                    type="text"
                    placeholder="Key insight..."
                    value={articleLearned}
                    onChange={(e) => setArticleLearned(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-neutral-200 rounded-xl hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!articleTitle.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Log Article
                </button>
              </div>
            </form>
          )}

          {tab === 'reflection' && (
            <form onSubmit={handleReflectionSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  What created value today?
                </label>
                <textarea
                  rows={3}
                  placeholder="Record an honest insight, breakthrough, or high-leverage moment..."
                  value={quickThought}
                  onChange={(e) => setQuickThought(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 resize-none"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-neutral-200 rounded-xl hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!quickThought.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

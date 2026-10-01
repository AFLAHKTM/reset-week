import React, { useState } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import type { TransactionCategory, TransactionType } from '../types';
import { formatCurrencyINR } from '../utils/dateUtils';
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    currentDayData,
    financeTodaySummary,
    financeWeeklySummary,
    addTransaction,
    deleteTransaction,
  } = useResetWeek();

  // Form states
  const [type, setType] = useState<TransactionType>('out');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Business');
  const [desc, setDesc] = useState('');

  const categories: TransactionCategory[] = [
    'Business',
    'Personal',
    'Office',
    'Food',
    'Travel',
    'Other',
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    addTransaction({
      amount: val,
      type,
      category,
      description: desc || `${type === 'in' ? 'Income' : 'Expense'} - ${category}`,
      date: currentDayData.date,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });

    setAmount('');
    setDesc('');
  };

  const dayTransactions = currentDayData?.transactions || [];

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Cash Flow & Awareness
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            TRANSACTION CHECK
          </h2>
        </div>

        <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* TODAY'S FINANCIAL CHECK-IN (2x2 on Mobile) */}
      <section className="space-y-2.5">
        <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400">
          Today's Position · {currentDayData.dayName}
        </h3>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {/* Money In */}
          <div className="p-3 sm:p-4 rounded-xl bg-obsidian-900 border border-neutral-800/80">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Money In</span>
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-base sm:text-2xl font-bold font-mono text-emerald-400 mt-1 truncate">
              {formatCurrencyINR(financeTodaySummary.income)}
            </div>
          </div>

          {/* Money Out */}
          <div className="p-3 sm:p-4 rounded-xl bg-obsidian-900 border border-neutral-800/80">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Money Out</span>
              <TrendingDown className="w-3 h-3 text-rose-400" />
            </div>
            <div className="text-base sm:text-2xl font-bold font-mono text-rose-400 mt-1 truncate">
              {formatCurrencyINR(financeTodaySummary.expenses)}
            </div>
          </div>

          {/* Pending */}
          <div className="p-3 sm:p-4 rounded-xl bg-obsidian-900 border border-neutral-800/80">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Pending</span>
              <Clock className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-base sm:text-2xl font-bold font-mono text-amber-400 mt-1 truncate">
              {formatCurrencyINR(financeTodaySummary.pending)}
            </div>
          </div>

          {/* Today's Balance / Net */}
          <div className="p-3 sm:p-4 rounded-xl bg-obsidian-900 border border-neutral-800/80">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Today's Balance</span>
              <CircleDollarSign className="w-3 h-3 text-neutral-300" />
            </div>
            <div
              className={`text-base sm:text-2xl font-bold font-mono mt-1 truncate ${
                financeTodaySummary.balance >= 0 ? 'text-white' : 'text-rose-400'
              }`}
            >
              {formatCurrencyINR(financeTodaySummary.balance)}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ENTRY FORM */}
      <section className="bg-obsidian-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-elevated space-y-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
          + Add Transaction
        </h3>

        <form onSubmit={handleAdd} className="space-y-3">
          {/* Segmented Type Toggle */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
            {(['out', 'in', 'pending'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  type === t
                    ? t === 'in'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : t === 'out'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {t === 'in' ? 'In' : t === 'out' ? 'Out' : 'Pending'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 font-mono focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-neutral-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              Description
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Client deposit, Office cables..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
              />
              <button
                type="submit"
                disabled={!amount}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 flex-shrink-0 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* TODAY'S TRANSACTION STREAM */}
      <section className="space-y-2.5">
        <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400">
          Today's Entries ({dayTransactions.length})
        </h3>

        {dayTransactions.length === 0 ? (
          <div className="p-5 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs">
            No transactions logged today yet. Complete your daily Transaction Check.
          </div>
        ) : (
          <div className="space-y-1.5">
            {dayTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-obsidian-900 border border-neutral-800/80 rounded-xl"
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      tx.type === 'in'
                        ? 'bg-emerald-500'
                        : tx.type === 'out'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{tx.description}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-800 text-neutral-400 flex-shrink-0">
                        {tx.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {tx.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span
                    className={`font-mono text-xs sm:text-sm font-bold ${
                      tx.type === 'in'
                        ? 'text-emerald-400'
                        : tx.type === 'out'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {tx.type === 'in' ? '+' : tx.type === 'out' ? '-' : '⌛'}{' '}
                    {formatCurrencyINR(tx.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1 text-neutral-600 hover:text-rose-400 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WEEKLY FINANCIAL SUMMARY */}
      <section className="p-4 sm:p-5 bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-neutral-800 rounded-2xl space-y-3.5 shadow-elevated">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
            WEEKLY SUMMARY
          </h3>
          <span className="text-[10px] sm:text-xs font-mono text-neutral-400">Cycle Overview</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Total Income</span>
            <span className="text-base sm:text-xl font-bold font-mono text-emerald-400 mt-0.5 block truncate">
              {formatCurrencyINR(financeWeeklySummary.income)}
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Total Expenses</span>
            <span className="text-base sm:text-xl font-bold font-mono text-rose-400 mt-0.5 block truncate">
              {formatCurrencyINR(financeWeeklySummary.expenses)}
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Net Balance</span>
            <span
              className={`text-base sm:text-xl font-bold font-mono mt-0.5 block truncate ${
                financeWeeklySummary.net >= 0 ? 'text-white' : 'text-rose-400'
              }`}
            >
              {formatCurrencyINR(financeWeeklySummary.net)}
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-xs font-mono text-neutral-400 block">Total Pending</span>
            <span className="text-base sm:text-xl font-bold font-mono text-amber-400 mt-0.5 block truncate">
              {formatCurrencyINR(financeWeeklySummary.pending)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

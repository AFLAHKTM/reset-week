// Helper date utilities for Friday -> Friday Reset Week

export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Given any date, find the Friday that started this Reset Week.
 * If today is Friday, it starts today.
 * If today is Saturday..Thursday, it started the previous Friday.
 */
export function getPreviousOrCurrentFriday(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 5 is Friday
  // Days since last Friday:
  // Friday (5) -> 0 days ago
  // Saturday (6) -> 1 day ago
  // Sunday (0) -> 2 days ago
  // Monday (1) -> 3 days ago
  // Tuesday (2) -> 4 days ago
  // Wednesday (3) -> 5 days ago
  // Thursday (4) -> 6 days ago
  const diff = (dayOfWeek + 7 - 5) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

/**
 * Generate the 7 consecutive days starting from Friday
 */
export function generateCycleDays(startDate: Date): Array<{
  date: string;
  dayName: string;
  dayIndex: number;
  formatted: string;
}> {
  const days = [];
  const dayNames = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const iso = formatISODate(d);
    days.push({
      date: iso,
      dayName: dayNames[i],
      dayIndex: i + 1,
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return days;
}

export function formatTime12h(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

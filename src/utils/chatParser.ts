import type { ScheduleItemType, DetectedSchedule } from '../types';
import { parseISODate, formatISODate } from './dateUtils';

interface ClauseMatch {
  key: 'on' | 'at' | 'duration' | 'for' | 'with';
  startIndex: number;
  contentStart: number;
}

/**
 * Normalizes duration string to standard format: "X min" or "X hour(s)"
 */
function normalizeDuration(raw: string): string {
  const match = raw.match(/(\d+(?:\.\d+)?)\s*(min|mins|minute|minutes|hour|hours|hr|hrs|m|h)?/i);
  if (!match) return '45 min';

  const val = parseFloat(match[1]);
  const unit = (match[2] || 'min').toLowerCase();

  if (unit.startsWith('h')) {
    return `${val} hour${val > 1 ? 's' : ''}`;
  }
  return `${val} min`;
}

/**
 * Extracts and formats time from text (e.g. "11:30 AM", "4pm", "16:00", "5:30", "evening")
 */
function extractFormattedTime(text: string): string | null {
  const lower = text.toLowerCase();

  // 12-hour with AM/PM (e.g. "11:30 AM", "11:30am", "4pm", "4 PM")
  const match12 = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (match12) {
    const hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? match12[2] : '00';
    const period = match12[3].toUpperCase();
    return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
  }

  // 24-hour (e.g. "14:30", "09:15")
  const match24 = lower.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (match24) {
    let h = parseInt(match24[1], 10);
    const m = match24[2];
    const period = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${m} ${period}`;
  }

  // Pure hour number (e.g. "on 4" or "at 5" or "11")
  const matchHour = lower.match(/\b(\d{1,2})(?::(\d{2}))?\b/);
  if (matchHour) {
    const rawH = parseInt(matchHour[1], 10);
    if (rawH >= 1 && rawH <= 24) {
      const minutes = matchHour[2] || '00';
      let h = rawH;
      let period: 'AM' | 'PM' = 'AM';
      if (h >= 13 && h <= 24) {
        period = 'PM';
        h -= 12;
      } else if (h >= 1 && h <= 7) {
        period = 'PM';
      } else if (h >= 8 && h <= 11) {
        period = 'AM';
      } else if (h === 12) {
        period = 'PM';
      }
      return `${String(h).padStart(2, '0')}:${minutes} ${period}`;
    }
  }

  // Named periods
  if (lower.includes('morning')) return '09:30 AM';
  if (lower.includes('noon')) return '12:00 PM';
  if (lower.includes('afternoon')) return '02:30 PM';
  if (lower.includes('evening')) return '06:00 PM';
  if (lower.includes('night')) return '08:30 PM';

  return null;
}

/**
 * Intelligent parser that extracts schedule details from a message:
 * - Text follows "on": Added to time (& date)
 * - Text follows "at" or "@": Added to location
 * - "duration" / duration pattern: Added to duration
 * - Text follows "for": Added to agenda and notes
 * - Preserves the title EXACTLY as typed by the user.
 */
export function detectScheduleFromText(
  text: string,
  currentDate: string,
  weekDayKeys: string[] = []
): DetectedSchedule {
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // Find all clause markers
  // Markers: "on", "at" / "@", "duration", "for", "with"
  const markerRegex = /(?:\b(on|for|with)\s+)|(?:\b(duration)(?:\s*:|\s+is|\s+of)?\s+)|(?:\b(at)\s+|(@)\s*)/gi;
  const matches: ClauseMatch[] = [];

  let match: RegExpExecArray | null;
  while ((match = markerRegex.exec(cleanText)) !== null) {
    let key: ClauseMatch['key'] = 'on';
    if (match[1]) {
      const k = match[1].toLowerCase();
      if (k === 'on') key = 'on';
      else if (k === 'for') key = 'for';
      else if (k === 'with') key = 'with';
    } else if (match[2]) {
      key = 'duration';
    } else if (match[3] || match[4]) {
      key = 'at';
    }

    matches.push({
      key,
      startIndex: match.index,
      contentStart: match.index + match[0].length,
    });
  }

  // Sort matches by appearance in string
  matches.sort((a, b) => a.startIndex - b.startIndex);

  // Extract slices for each matched clause
  const clauses: Partial<Record<ClauseMatch['key'], string>> = {};
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].startIndex : cleanText.length;
    const rawVal = cleanText.slice(cur.contentStart, nextStart).trim();
    // Clean trailing punctuation
    const cleanVal = rawVal.replace(/[,;.]\s*$/, '').trim();
    clauses[cur.key] = cleanVal;
  }

  // 1. Text follows "on" -> Time (and Date if date keywords are present)
  let timeStr = '10:00 AM';

  if (clauses.on) {
    const parsedTime = extractFormattedTime(clauses.on);
    if (parsedTime) {
      timeStr = parsedTime;
    }
  } else {
    // Fallback: check full text for time
    const parsedTime = extractFormattedTime(cleanText);
    if (parsedTime) {
      timeStr = parsedTime;
    }
  }

  // 2. Date Extraction (inspect "on" segment first, then full text)
  let targetDate = currentDate;
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const textToCheckForDate = (clauses.on ? clauses.on.toLowerCase() + ' ' : '') + lower;

  if (textToCheckForDate.includes('tomorrow')) {
    const curr = parseISODate(currentDate);
    curr.setDate(curr.getDate() + 1);
    targetDate = formatISODate(curr);
  } else if (textToCheckForDate.includes('today')) {
    targetDate = currentDate;
  } else {
    for (const dKey of weekDayKeys) {
      const dObj = parseISODate(dKey);
      const dName = dayNames[dObj.getDay()];
      if (textToCheckForDate.includes(dName)) {
        targetDate = dKey;
        break;
      }
    }
  }

  // 3. Text follows "at" or "@" -> Location
  let locationStr: string | undefined = undefined;
  if (clauses.at) {
    // If the text after "at" was a pure time (e.g. "at 10 AM") and "on" was NOT provided:
    const isPureTime = /^\d{1,2}(?::\d{2})?\s*(am|pm)?$/i.test(clauses.at);
    if (isPureTime && !clauses.on) {
      const parsedTime = extractFormattedTime(clauses.at);
      if (parsedTime) timeStr = parsedTime;
    } else {
      locationStr = clauses.at;
    }
  }

  // Fallback location detection if "at" or "@" was not used
  if (!locationStr) {
    if (lower.includes('google meet')) locationStr = 'Google Meet';
    else if (lower.includes('zoom')) locationStr = 'Zoom';
    else if (lower.includes('office') || lower.includes('studio')) locationStr = 'Office';
    else if (lower.includes('home') || lower.includes('house')) locationStr = 'Home';
    else if (lower.includes('cafe') || lower.includes('coffee')) locationStr = 'Cafe';
    else if (lower.includes('phone') || lower.includes('call')) locationStr = 'Phone Call';
  }

  // 4. "duration" -> Duration
  let durationStr = '45 min';
  if (clauses.duration) {
    durationStr = normalizeDuration(clauses.duration);
  } else {
    // Standalone duration in text (e.g. "30 mins", "1 hour", "45m")
    const matchDur = lower.match(/\b(\d+(?:\.\d+)?)\s*(min|mins|minute|minutes|hour|hours|hr|hrs|m)\b/i);
    if (matchDur) {
      durationStr = normalizeDuration(matchDur[0]);
    }
  }

  // 5. Text follows "for" -> Agenda and Notes
  let agendaAndNotes: string | undefined = undefined;
  if (clauses.for) {
    agendaAndNotes = clauses.for;
  }

  // 6. Person extraction (from "with" clause or regex)
  let personStr: string | undefined = undefined;
  if (clauses.with) {
    personStr = clauses.with;
  } else {
    const personMatch = cleanText.match(/\b(?:with|call|meet|sync with)\s+([A-Z][a-zA-Z0-9_.-]+)/);
    if (personMatch && personMatch[1]) {
      personStr = personMatch[1];
    }
  }

  // 7. Determine Type
  let type: ScheduleItemType = 'meeting';
  if (lower.includes('visit') || lower.includes('home') || lower.includes('family')) {
    type = 'visit';
  } else if (
    lower.includes('program') ||
    lower.includes('event') ||
    lower.includes('masjid') ||
    lower.includes('aurad') ||
    lower.includes('haddad') ||
    lower.includes('yaseen') ||
    lower.includes('fath')
  ) {
    type = 'program';
  } else if (
    lower.includes('shopping') ||
    lower.includes('groceries') ||
    lower.includes('routine') ||
    lower.includes('reminder') ||
    lower.includes('task') ||
    lower.includes('errand')
  ) {
    type = 'schedule';
  } else {
    type = 'meeting';
  }

  // 8. Extract concise main heading (e.g. "Hospital Visit", "Meeting with Zack")
  const mainHeading = extractMainHeading(cleanText, type);

  return {
    title: mainHeading,
    rawText: cleanText,
    person: personStr,
    type,
    date: targetDate,
    time: timeStr,
    duration: durationStr,
    location: locationStr || undefined,
    agenda: agendaAndNotes,
    notes: agendaAndNotes || 'Scheduled via Chatbot',
  };
}

/**
 * Extracts the clean core subject / main heading from a schedule message,
 * removing parameter clauses like "on ...", "at ...", "for ...", "duration ...", time/date.
 * E.g.: "Hospital Visit at 7 AM today at Orchid Hospital for Basheer Usthad." -> "Hospital Visit"
 */
export function extractMainHeading(text: string, fallbackType: ScheduleItemType = 'meeting'): string {
  if (!text || !text.trim()) {
    return fallbackType.charAt(0).toUpperCase() + fallbackType.slice(1);
  }

  const cleanText = text.trim();

  // Pattern that identifies any parameter/clause start:
  // - "on <time/date>"
  // - "at <location/time>" or "@ <location>"
  // - "duration ..."
  // - "for <agenda>"
  // - standalone time (e.g. "7am", "11:30 AM", "4 PM")
  // - standalone day words ("today", "tomorrow", "sunday", etc.)
  const paramMarkerRegex = /(?:\b(on|for)\s+)|(?:\b(duration)(?:\s*:|\s+is|\s+of)?\s+)|(?:\b(at)\s+|(@)\s*)|(?:\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b)|(?:\b(today|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b)/i;

  const match = paramMarkerRegex.exec(cleanText);
  if (match && match.index > 0) {
    const candidate = cleanText.slice(0, match.index).replace(/[-–—,:;.]+\s*$/, '').trim();
    if (candidate.length >= 2) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  // If marker was at index 0, try stripping parameter clauses
  if (match && match.index === 0) {
    const stripped = cleanText
      .replace(/(?:\b(on|at|for|duration)\b|@)[^a-zA-Z0-9]*[a-zA-Z0-9\s:.-]*?(?=\b(on|at|for|duration|with)\b|@|$)/gi, ' ')
      .replace(/\b(today|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, ' ')
      .replace(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi, ' ')
      .replace(/[-–—,:;.]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (stripped.length >= 2) {
      return stripped.charAt(0).toUpperCase() + stripped.slice(1);
    }
  }

  // If no marker matched, clean up any trailing punctuation
  const candidate = cleanText.replace(/[-–—,:;.]+\s*$/, '').trim();
  if (candidate) {
    return candidate.charAt(0).toUpperCase() + candidate.slice(1);
  }

  return fallbackType.charAt(0).toUpperCase() + fallbackType.slice(1);
}

import type { ScheduleItemType, DetectedSchedule } from '../types';
import { parseISODate, formatISODate } from './dateUtils';

/**
 * Intelligent parser that extracts schedule details from a message
 * while preserving the title EXACTLY as typed by the user.
 */
export function detectScheduleFromText(
  text: string,
  currentDate: string,
  weekDayKeys: string[] = []
): DetectedSchedule {
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Extract Time
  // Match patterns like "10:30 AM", "10:30am", "4pm", "4 PM", "at 4", "16:00"
  let timeStr = '10:00 AM';

  const timeRegex12 = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
  const timeRegexAt = /\bat\s+(\d{1,2})(?::(\d{2}))?\b/i;
  const timeRegex24 = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;

  const match12 = lower.match(timeRegex12);
  if (match12) {
    const hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? match12[2] : '00';
    const period = match12[3].toUpperCase();
    timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
  } else {
    const matchAt = lower.match(timeRegexAt);
    if (matchAt) {
      let hours = parseInt(matchAt[1], 10);
      const minutes = matchAt[2] ? matchAt[2] : '00';
      const period = hours >= 1 && hours <= 7 ? 'PM' : 'AM';
      timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
    } else {
      const match24 = lower.match(timeRegex24);
      if (match24) {
        let h = parseInt(match24[1], 10);
        const m = match24[2];
        const period = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        timeStr = `${String(h).padStart(2, '0')}:${m} ${period}`;
      } else if (lower.includes('morning')) {
        timeStr = '09:30 AM';
      } else if (lower.includes('afternoon')) {
        timeStr = '02:30 PM';
      } else if (lower.includes('evening')) {
        timeStr = '06:00 PM';
      } else if (lower.includes('night')) {
        timeStr = '08:30 PM';
      }
    }
  }

  // 2. Extract Date
  let targetDate = currentDate;
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  if (lower.includes('tomorrow')) {
    const curr = parseISODate(currentDate);
    curr.setDate(curr.getDate() + 1);
    targetDate = formatISODate(curr);
  } else if (lower.includes('today')) {
    targetDate = currentDate;
  } else {
    // Check for day of the week in weekDayKeys
    let foundDayKey: string | null = null;
    for (const dKey of weekDayKeys) {
      const dObj = parseISODate(dKey);
      const dName = dayNames[dObj.getDay()];
      if (lower.includes(dName)) {
        foundDayKey = dKey;
        break;
      }
    }

    if (foundDayKey) {
      targetDate = foundDayKey;
    }
  }

  // 3. Extract Duration
  let durationStr = '45 min';
  const durationMatch = lower.match(/\b(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs|m)\b/i);
  if (durationMatch) {
    const val = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2].toLowerCase();
    if (unit.startsWith('h')) {
      durationStr = `${val} hour${val > 1 ? 's' : ''}`;
    } else {
      durationStr = `${val} min`;
    }
  }

  // 4. Determine Type
  let type: ScheduleItemType = 'meeting';
  if (lower.includes('visit') || lower.includes('home') || lower.includes('family')) {
    type = 'visit';
  } else if (lower.includes('program') || lower.includes('event') || lower.includes('masjid') || lower.includes('aurad') || lower.includes('haddad')) {
    type = 'program';
  } else if (lower.includes('routine') || lower.includes('reminder') || lower.includes('shopping') || lower.includes('task')) {
    type = 'schedule';
  } else {
    type = 'meeting';
  }

  // 5. Extract Location or Platform
  let locationStr = '';
  if (lower.includes('google meet')) {
    locationStr = 'Google Meet';
  } else if (lower.includes('zoom')) {
    locationStr = 'Zoom';
  } else if (lower.includes('office') || lower.includes('studio')) {
    locationStr = 'Office';
  } else if (lower.includes('home') || lower.includes('house')) {
    locationStr = 'Home';
  } else if (lower.includes('cafe') || lower.includes('coffee')) {
    locationStr = 'Cafe';
  } else if (lower.includes('phone') || lower.includes('call')) {
    locationStr = 'Phone Call';
  }

  // 6. Extract Person if mentioned (e.g. "with Zack", "call Zack", "meet Omar")
  let personStr: string | undefined = undefined;
  const personMatch = cleanText.match(/\b(?:with|call|meet|sync with)\s+([A-Z][a-zA-Z0-9_.-]+)/);
  if (personMatch && personMatch[1]) {
    personStr = personMatch[1];
  }

  // Title: SCHEDULED EXACTLY AS TYPED!
  return {
    title: cleanText,
    person: personStr,
    type,
    date: targetDate,
    time: timeStr,
    duration: durationStr,
    location: locationStr || undefined,
    notes: 'Scheduled via Chatbot',
  };
}

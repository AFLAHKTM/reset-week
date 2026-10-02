import type { ScheduleItemType, DetectedSchedule } from '../types';
import { parseISODate, formatISODate } from './dateUtils';

/**
 * Intelligent regex and heuristic parser that inspects a chat message
 * and detects scheduling intents, dates, times, durations, and locations.
 */
export function detectScheduleFromText(
  text: string,
  contactName: string,
  currentDate: string,
  weekDayKeys: string[] = []
): DetectedSchedule | null {
  const lower = text.toLowerCase();

  // 1. Check for schedule or meeting intent triggers
  const intentKeywords = [
    'meet',
    'meeting',
    'call',
    'schedule',
    'scheduled',
    'sync',
    'catch up',
    'appointment',
    'session',
    'visit',
    'program',
    'zoom',
    'google meet',
    'discussion',
    'review',
    'connect',
    'at ',
    'tomorrow',
    'today',
    'friday',
    'saturday',
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
  ];

  const hasIntent = intentKeywords.some((kw) => lower.includes(kw));
  if (!hasIntent) return null;

  // 2. Extract Time
  // Match patterns like "10:30 AM", "10:30am", "4pm", "4 PM", "at 4", "16:00"
  let timeStr = '10:00 AM'; // default fallback
  let foundTime = false;

  const timeRegex12 = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
  const timeRegexAt = /\bat\s+(\d{1,2})(?::(\d{2}))?\b/i;
  const timeRegex24 = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;

  const match12 = lower.match(timeRegex12);
  if (match12) {
    const hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? match12[2] : '00';
    const period = match12[3].toUpperCase();
    timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
    foundTime = true;
  } else {
    const matchAt = lower.match(timeRegexAt);
    if (matchAt) {
      let hours = parseInt(matchAt[1], 10);
      const minutes = matchAt[2] ? matchAt[2] : '00';
      // Infer AM/PM based on common business hours (e.g. 1 to 7 is usually PM, 8 to 11 is AM)
      const period = hours >= 1 && hours <= 7 ? 'PM' : 'AM';
      timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
      foundTime = true;
    } else {
      const match24 = lower.match(timeRegex24);
      if (match24) {
        let h = parseInt(match24[1], 10);
        const m = match24[2];
        const period = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        timeStr = `${String(h).padStart(2, '0')}:${m} ${period}`;
        foundTime = true;
      } else if (lower.includes('morning')) {
        timeStr = '09:30 AM';
        foundTime = true;
      } else if (lower.includes('afternoon')) {
        timeStr = '02:30 PM';
        foundTime = true;
      } else if (lower.includes('evening')) {
        timeStr = '06:00 PM';
        foundTime = true;
      } else if (lower.includes('night')) {
        timeStr = '08:30 PM';
        foundTime = true;
      }
    }
  }

  // 3. Extract Date
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

  // 4. Extract Duration
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

  // 5. Determine Type
  let type: ScheduleItemType = 'meeting';
  if (lower.includes('visit') || lower.includes('home') || lower.includes('family')) {
    type = 'visit';
  } else if (lower.includes('program') || lower.includes('event') || lower.includes('masjid') || lower.includes('aurad') || lower.includes('haddad')) {
    type = 'program';
  } else if (lower.includes('schedule') || lower.includes('routine') || lower.includes('reminder')) {
    type = 'schedule';
  } else {
    type = 'meeting';
  }

  // 6. Extract Location or Platform
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

  // 7. Extract Title / Topic
  let titleStr = '';
  const forMatch = text.match(/\b(?:for|about|discussing|regarding|to discuss)\s+([a-zA-Z0-9\s,&'-]{3,35})/i);
  if (forMatch && forMatch[1]) {
    const topic = forMatch[1].trim().replace(/\s+(at|on|tomorrow|today|with|in)\b.*$/i, '');
    if (topic.length > 2) {
      if (type === 'visit') {
        titleStr = `Home Visit (${topic})`;
      } else if (type === 'program') {
        titleStr = `${topic} Program`;
      } else {
        titleStr = `${topic} Sync`;
      }
    }
  }

  if (!titleStr) {
    if (type === 'visit') {
      titleStr = `Home Visit with ${contactName}`;
    } else if (type === 'program') {
      titleStr = `Program with ${contactName}`;
    } else {
      titleStr = `Meeting with ${contactName}`;
    }
  }

  // If there was no time found and the text doesn't explicitly look like a scheduling commitment, ignore
  const explicitCommitmentWords = ['let\'s meet', 'lets meet', 'schedule', 'scheduled', 'catch up', 'call at', 'meet at', 'call tomorrow', 'meet tomorrow', 'sync at'];
  const hasExplicitCommitment = explicitCommitmentWords.some(w => lower.includes(w));

  if (!foundTime && !hasExplicitCommitment) {
    return null;
  }

  return {
    title: titleStr,
    person: contactName.includes('Assistant') ? undefined : contactName,
    type,
    date: targetDate,
    time: timeStr,
    duration: durationStr,
    location: locationStr || undefined,
    notes: `Automatically scheduled from chat with ${contactName}`,
  };
}

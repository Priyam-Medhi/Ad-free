import type { CalendarDayEntry, FocusSpace } from '../types/recovery';

export interface CalendarCell {
  dateKey: string;
  year: number;
  monthIndex: number; // 0-11
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  entry: CalendarDayEntry | null;
}

export interface MonthSummary {
  year: number;
  monthIndex: number;
  cleanCount: number;
  relapseCount: number;
  totalLogged: number;
  cleanRatePercent: number;
  longestMonthCleanRun: number;
  patternSummary: string;
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function toDateKey(year: number, monthIndex: number, day: number): string {
  const yyyy = String(year).padStart(4, '0');
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function parseDateKey(dateKey: string): { year: number; monthIndex: number; day: number } {
  const [y, m, d] = dateKey.split('-').map(Number);
  return {
    year: y || 2026,
    monthIndex: (m || 1) - 1,
    day: d || 1,
  };
}

export function getTodayDateKey(now: Date = new Date()): string {
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function offsetDateKey(baseDateKey: string, deltaDays: number): string {
  const { year, monthIndex, day } = parseDateKey(baseDateKey);
  const d = new Date(year, monthIndex, day + deltaDays);
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
}

export function formatLongDate(dateKey: string): string {
  const { year, monthIndex, day } = parseDateKey(dateKey);
  const d = new Date(year, monthIndex, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getPrevMonth(year: number, monthIndex: number): { year: number; monthIndex: number } {
  if (monthIndex === 0) return { year: year - 1, monthIndex: 11 };
  return { year, monthIndex: monthIndex - 1 };
}

export function getNextMonth(year: number, monthIndex: number): { year: number; monthIndex: number } {
  if (monthIndex === 11) return { year: year + 1, monthIndex: 0 };
  return { year, monthIndex: monthIndex + 1 };
}

/**
 * Resolves a space's calendar logs, seamlessly backfilling from `history` if an older
 * persisted localStorage space does not yet contain `calendarLogs`.
 */
export function resolveSpaceCalendarLogs(
  space: FocusSpace,
  todayKey: string = getTodayDateKey()
): Record<string, CalendarDayEntry> {
  if (space.calendarLogs) {
    return space.calendarLogs;
  }

  const derived: Record<string, CalendarDayEntry> = {};
  const endOffset = space.checkedInToday ? 0 : -1;
  const total = space.history.length;
  space.history.forEach((pt, idx) => {
    const delta = endOffset - (total - 1 - idx);
    const key = offsetDateKey(todayKey, delta);
    derived[key] = {
      date: key,
      status: pt.status,
      freedomScore: pt.freedomScore,
      note: pt.note,
    };
  });

  return derived;
}

/**
 * Builds a Monday-first calendar grid (35 or 42 cells) for a given month.
 */
export function buildMonthGrid(
  year: number,
  monthIndex: number,
  logs: Record<string, CalendarDayEntry>,
  todayKey: string = getTodayDateKey()
): CalendarCell[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = startWeekday + daysInMonth > 35 ? 42 : 35;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - startWeekday + 1;
    const cellDate = new Date(year, monthIndex, dayOffset);
    const cYear = cellDate.getFullYear();
    const cMonth = cellDate.getMonth();
    const cDay = cellDate.getDate();
    const dateKey = toDateKey(cYear, cMonth, cDay);

    cells.push({
      dateKey,
      year: cYear,
      monthIndex: cMonth,
      dayNumber: cDay,
      inCurrentMonth: cYear === year && cMonth === monthIndex,
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
      entry: logs[dateKey] ?? null,
    });
  }

  return cells;
}

/**
 * Computes clean vs. relapse totals, clean rate, longest in-month clean run,
 * and a human-readable weekday pattern insight.
 */
export function computeMonthSummary(
  year: number,
  monthIndex: number,
  logs: Record<string, CalendarDayEntry>
): MonthSummary {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let cleanCount = 0;
  let relapseCount = 0;
  let currentRun = 0;
  let longestMonthCleanRun = 0;
  const relapseByWeekday = new Map<number, number>();

  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(year, monthIndex, day);
    const entry = logs[key];
    if (!entry) {
      currentRun = 0;
      continue;
    }

    if (entry.status === 'clean') {
      cleanCount += 1;
      currentRun += 1;
      if (currentRun > longestMonthCleanRun) {
        longestMonthCleanRun = currentRun;
      }
    } else {
      relapseCount += 1;
      currentRun = 0;
      const weekday = new Date(year, monthIndex, day).getDay();
      relapseByWeekday.set(weekday, (relapseByWeekday.get(weekday) ?? 0) + 1);
    }
  }

  const totalLogged = cleanCount + relapseCount;
  const cleanRatePercent = totalLogged === 0 ? 0 : Math.round((cleanCount / totalLogged) * 100);

  let patternSummary = 'No days logged in this month yet. Select any day to record a quiet reflection.';
  if (totalLogged > 0 && relapseCount === 0) {
    patternSummary = `Zero relapses logged across ${cleanCount} clean ${cleanCount === 1 ? 'day' : 'days'} this month—steady nervous-system rhythm.`;
  } else if (relapseCount > 0) {
    let topWeekday = 0;
    let topCount = 0;
    for (const [weekday, count] of relapseByWeekday.entries()) {
      if (count > topCount) {
        topCount = count;
        topWeekday = weekday;
      }
    }
    const dayName = WEEKDAY_NAMES[topWeekday];
    patternSummary =
      longestMonthCleanRun >= 7
        ? `Longest clean stretch this month: ${longestMonthCleanRun} days. Most resets fell on ${dayName}s—protect that evening boundary.`
        : `Resets clustered around ${dayName}s (${relapseCount} total). Plan a gentle replacement ritual ahead of ${dayName} evening.`;
  }

  return {
    year,
    monthIndex,
    cleanCount,
    relapseCount,
    totalLogged,
    cleanRatePercent,
    longestMonthCleanRun,
    patternSummary,
  };
}

/**
 * Generates deterministic seed calendar history anchored to `todayKey` so the current
 * month and preceding weeks immediately showcase clean stretches alongside past reset days.
 */
export function buildSeedCalendarLogs(todayKey: string): Record<string, CalendarDayEntry> {
  const logs: Record<string, CalendarDayEntry> = {};

  // 14 consecutive clean days ending yesterday (matching the 14-day active streak before today's check-in)
  const cleanNotes: Record<number, string> = {
    1: 'Phone stayed in hallway overnight; woke rested.',
    4: 'Evening digital sunset ritual held steady.',
    7: 'One full week clean—evening urge noticeably quieter.',
    10: 'Read two chapters instead of late-night scrolling.',
    14: 'First clean day after gentle reset; kept lamp & book bedside.',
  };

  for (let daysAgo = 1; daysAgo <= 14; daysAgo++) {
    const key = offsetDateKey(todayKey, -daysAgo);
    logs[key] = {
      date: key,
      status: 'clean',
      freedomScore: Math.min(99, 100 - daysAgo * 3),
      note: cleanNotes[daysAgo],
    };
  }

  // Earlier pattern across days -15 to -34 (showing relapse clusters + clean recovery days)
  const earlierEntries: { daysAgo: number; status: 'clean' | 'relapse'; note?: string }[] = [
    {
      daysAgo: 15,
      status: 'relapse',
      note: 'Late-night work stress led to 45m bedtime scrolling. Moved charger out of bedroom.',
    },
    { daysAgo: 16, status: 'clean', note: 'Morning walk kept focus calm.' },
    { daysAgo: 17, status: 'clean' },
    { daysAgo: 18, status: 'clean' },
    { daysAgo: 19, status: 'clean' },
    {
      daysAgo: 20,
      status: 'relapse',
      note: 'Fatigue after dinner triggered reflexive feed checking.',
    },
    { daysAgo: 21, status: 'clean' },
    { daysAgo: 22, status: 'clean' },
    { daysAgo: 23, status: 'clean' },
    { daysAgo: 25, status: 'clean' },
    { daysAgo: 26, status: 'clean' },
    {
      daysAgo: 27,
      status: 'relapse',
      note: 'Weekend evening boredom loop before bedtime.',
    },
    { daysAgo: 28, status: 'clean' },
    { daysAgo: 29, status: 'clean' },
    { daysAgo: 31, status: 'clean' },
    { daysAgo: 32, status: 'clean' },
  ];

  for (const item of earlierEntries) {
    const key = offsetDateKey(todayKey, -item.daysAgo);
    logs[key] = {
      date: key,
      status: item.status,
      freedomScore: item.status === 'clean' ? 76 : 18,
      note: item.note,
    };
  }

  return logs;
}

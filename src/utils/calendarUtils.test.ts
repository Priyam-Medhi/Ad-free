import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMonthGrid,
  buildSeedCalendarLogs,
  computeMonthSummary,
  getNextMonth,
  getPrevMonth,
  offsetDateKey,
  toDateKey,
} from './calendarUtils';

test('buildMonthGrid produces a Monday-first grid with exact November 2026 boundaries', () => {
  const todayKey = '2026-11-18';
  const logs = buildSeedCalendarLogs(todayKey);
  const cells = buildMonthGrid(2026, 10, logs, todayKey); // November = monthIndex 10

  // Nov 1, 2026 is a Sunday -> startWeekday = 6 -> 6 + 30 = 36 -> 42-cell grid
  assert.equal(cells.length, 42);
  const nov1 = cells.find((c) => c.dateKey === '2026-11-01');
  assert.ok(nov1);
  assert.equal(nov1.inCurrentMonth, true);
  assert.equal(cells.indexOf(nov1), 6); // Sunday column (index 6 in Mon-Sun grid)

  const todayCell = cells.find((c) => c.dateKey === '2026-11-18');
  assert.ok(todayCell);
  assert.equal(todayCell.isToday, true);
  assert.equal(todayCell.isFuture, false);

  const nov19 = cells.find((c) => c.dateKey === '2026-11-19');
  assert.ok(nov19);
  assert.equal(nov19.isFuture, true);
});

test('buildSeedCalendarLogs creates 14 consecutive clean days ending yesterday plus earlier reset days', () => {
  const todayKey = '2026-11-18';
  const logs = buildSeedCalendarLogs(todayKey);

  for (let d = 1; d <= 14; d++) {
    const key = offsetDateKey(todayKey, -d);
    assert.equal(logs[key]?.status, 'clean', `Expected ${key} to be clean`);
  }

  // Day -15 (Nov 3, 2026) is a relapse reset day
  assert.equal(logs['2026-11-03']?.status, 'relapse');
});

test('computeMonthSummary accurately calculates clean/relapse counts, clean rate, and longest run', () => {
  const todayKey = '2026-11-18';
  const logs = buildSeedCalendarLogs(todayKey);

  // In Nov 2026: Nov 1 (clean), Nov 2 (clean), Nov 3 (relapse), Nov 4-17 (14 clean) => 16 clean, 1 relapse
  const novSummary = computeMonthSummary(2026, 10, logs);
  assert.equal(novSummary.cleanCount, 16);
  assert.equal(novSummary.relapseCount, 1);
  assert.equal(novSummary.totalLogged, 17);
  assert.equal(novSummary.cleanRatePercent, 94);
  assert.equal(novSummary.longestMonthCleanRun, 14);
  assert.match(novSummary.patternSummary, /Longest clean stretch this month: 14 days/);

  // Empty future month summary
  const decSummary = computeMonthSummary(2026, 11, logs);
  assert.equal(decSummary.totalLogged, 0);
  assert.equal(decSummary.cleanRatePercent, 0);
});

test('getPrevMonth and getNextMonth wrap cleanly across year boundaries', () => {
  assert.deepEqual(getPrevMonth(2026, 0), { year: 2025, monthIndex: 11 });
  assert.deepEqual(getNextMonth(2026, 11), { year: 2027, monthIndex: 0 });
  assert.equal(toDateKey(2026, 0, 5), '2026-01-05');
});

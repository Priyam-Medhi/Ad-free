import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Eraser,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { FocusSpace } from '../types/recovery';
import {
  buildMonthGrid,
  computeMonthSummary,
  formatLongDate,
  getNextMonth,
  getPrevMonth,
  getTodayDateKey,
  MONTH_NAMES,
  parseDateKey,
  resolveSpaceCalendarLogs,
} from '../utils/calendarUtils';

type CalendarFilter = 'all' | 'clean' | 'relapse';

interface MonthlyCalendarCardProps {
  space: FocusSpace;
  onUpdateCalendarDay: (dateKey: string, status: 'clean' | 'relapse' | null, note?: string) => void;
}

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function MonthlyCalendarCard({
  space,
  onUpdateCalendarDay,
}: MonthlyCalendarCardProps) {
  const todayKey = useMemo(() => getTodayDateKey(), []);
  const todayParsed = useMemo(() => parseDateKey(todayKey), [todayKey]);

  const [viewYear, setViewYear] = useState(todayParsed.year);
  const [viewMonthIndex, setViewMonthIndex] = useState(todayParsed.monthIndex);
  const [filter, setFilter] = useState<CalendarFilter>('all');
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  // Reset selected date cleanly when switching focus spaces
  useEffect(() => {
    setViewYear(todayParsed.year);
    setViewMonthIndex(todayParsed.monthIndex);
    setSelectedDateKey(todayKey);
  }, [space.id, todayKey, todayParsed.year, todayParsed.monthIndex]);

  const logs = useMemo(() => resolveSpaceCalendarLogs(space, todayKey), [space, todayKey]);

  const cells = useMemo(
    () => buildMonthGrid(viewYear, viewMonthIndex, logs, todayKey),
    [viewYear, viewMonthIndex, logs, todayKey]
  );

  const summary = useMemo(
    () => computeMonthSummary(viewYear, viewMonthIndex, logs),
    [viewYear, viewMonthIndex, logs]
  );

  const isViewingCurrentMonth =
    viewYear === todayParsed.year && viewMonthIndex === todayParsed.monthIndex;

  const selectedEntry = logs[selectedDateKey] ?? null;
  const isSelectedFuture = selectedDateKey > todayKey;

  const handlePrevMonth = () => {
    const prev = getPrevMonth(viewYear, viewMonthIndex);
    setViewYear(prev.year);
    setViewMonthIndex(prev.monthIndex);
  };

  const handleNextMonth = () => {
    const next = getNextMonth(viewYear, viewMonthIndex);
    setViewYear(next.year);
    setViewMonthIndex(next.monthIndex);
  };

  const handleJumpToday = () => {
    setViewYear(todayParsed.year);
    setViewMonthIndex(todayParsed.monthIndex);
    setSelectedDateKey(todayKey);
  };

  const monthHeading = `${MONTH_NAMES[viewMonthIndex]} ${viewYear}`;

  return (
    <section
      aria-label="Monthly Recovery Calendar"
      className="rounded-[28px] bg-[#fffdf9] border border-[#d8d0c8]/60 p-5 sm:p-6 shadow-sahara space-y-5"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-[#c2652a]">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Monthly Rhythm</span>
          </span>
          <h2
            className="font-serif text-[1.6rem] sm:text-[1.8rem] leading-tight font-semibold text-[#2d241e] mt-0.5"
            data-testid="calendar-month-heading"
          >
            {monthHeading}
          </h2>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-1.5">
          {!isViewingCurrentMonth && (
            <button
              type="button"
              onClick={handleJumpToday}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#f5efe6] hover:bg-[#ebe1d4] text-xs font-semibold text-[#c2652a] whitespace-nowrap transition-colors"
            >
              Today
            </button>
          )}
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="w-10 h-10 rounded-xl bg-[#f5efe6] hover:bg-[#ebe1d4] text-[#5c4f46] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="w-10 h-10 rounded-xl bg-[#f5efe6] hover:bg-[#ebe1d4] text-[#5c4f46] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Summary Stats & Interactive Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap pb-1 border-b border-[#efe7dc]">
        <div className="flex items-center gap-3 text-xs sm:text-[13px] text-[#5c4f46] flex-wrap tabular-nums">
          <span className="inline-flex items-center gap-1.5" data-testid="calendar-clean-count">
            <Check className="w-3.5 h-3.5 text-[#c2652a] stroke-[2.5]" aria-hidden="true" />
            <strong className="font-semibold text-[#2d241e]">{summary.cleanCount}</strong> clean
          </span>
          <span className="text-[#c8bdb2]" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5" data-testid="calendar-relapse-count">
            <RotateCcw className="w-3.5 h-3.5 text-[#8c3c3c]" aria-hidden="true" />
            <strong className="font-semibold text-[#2d241e]">{summary.relapseCount}</strong>{' '}
            {summary.relapseCount === 1 ? 'relapse' : 'relapses'}
          </span>
          <span className="text-[#c8bdb2]" aria-hidden="true">
            ·
          </span>
          <span data-testid="calendar-clean-rate">
            <strong className="font-semibold text-[#c2652a]">{summary.cleanRatePercent}%</strong>{' '}
            clarity
          </span>
        </div>

        {/* Segmented Filter Control */}
        <div
          role="group"
          aria-label="Highlight calendar days"
          className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-[#f3ece1]"
        >
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'clean', label: 'Clean' },
              { id: 'relapse', label: 'Relapse' },
            ] as const
          ).map((option) => {
            const active = filter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#fffdf9] text-[#2d241e] shadow-xs font-semibold'
                    : 'text-[#6b5d53] hover:text-[#2d241e]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="grid grid-cols-7 gap-1.5 mb-2" aria-hidden="true">
          {WEEKDAY_HEADERS.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-semibold tracking-[0.06em] uppercase text-[#87786c] py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-7 gap-1.5"
          role="grid"
          aria-label={`${monthHeading} daily log grid`}
          data-testid="monthly-calendar-grid"
        >
          {cells.map((cell) => {
            const status = cell.entry?.status ?? null;
            const isSelected = cell.dateKey === selectedDateKey;
            const dimmedByFilter =
              filter !== 'all' && cell.inCurrentMonth && status !== filter;

            let surfaceClasses =
              'bg-[#faf6f0] hover:bg-[#f2e9de] text-[#5c4f46] border-transparent';

            if (!cell.inCurrentMonth) {
              surfaceClasses =
                'bg-transparent text-[#bfb3a6] border-transparent hover:bg-[#f6f0e8]/60';
            } else if (status === 'clean') {
              surfaceClasses = isSelected
                ? 'bg-[#c2652a] text-[#fffdf9] border-[#c2652a] shadow-sahara-sm'
                : 'bg-[#f8e6d8] hover:bg-[#f2d8c4] text-[#7c3912] border-[#e6c4aa]';
            } else if (status === 'relapse') {
              surfaceClasses = isSelected
                ? 'bg-[#8c3c3c] text-[#fffdf9] border-[#8c3c3c] shadow-sahara-sm'
                : 'bg-[#f5e1e1] hover:bg-[#edd0d0] text-[#732d2d] border-[#dfb8b8] border-dashed';
            } else if (isSelected) {
              surfaceClasses = 'bg-[#efe6da] text-[#2d241e] border-[#c2652a]';
            } else if (cell.isFuture) {
              surfaceClasses = 'bg-transparent text-[#b8aca0] border-transparent';
            }

            const statusLabel =
              status === 'clean'
                ? 'Clean day'
                : status === 'relapse'
                  ? 'Relapse day'
                  : cell.isFuture
                    ? 'Upcoming day'
                    : 'Unlogged day';

            return (
              <button
                key={cell.dateKey}
                type="button"
                disabled={cell.isFuture && cell.inCurrentMonth}
                onClick={() => {
                  if (!cell.inCurrentMonth) {
                    setViewYear(cell.year);
                    setViewMonthIndex(cell.monthIndex);
                  }
                  setSelectedDateKey(cell.dateKey);
                }}
                aria-label={`${formatLongDate(cell.dateKey)}: ${statusLabel}${cell.isToday ? ' (Today)' : ''}`}
                aria-pressed={isSelected}
                data-status={status ?? 'unlogged'}
                data-date={cell.dateKey}
                className={`relative min-h-[44px] sm:min-h-[48px] rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all tabular-nums ${surfaceClasses} ${
                  cell.isToday && !isSelected ? 'ring-2 ring-[#2d241e]/35 ring-offset-1 ring-offset-[#fffdf9]' : ''
                } ${dimmedByFilter ? 'opacity-25' : ''} disabled:opacity-45 disabled:cursor-default`}
              >
                <span className="text-[13px] font-semibold leading-none">{cell.dayNumber}</span>

                {/* Non-color-only status glyphs for Clean vs Relapse */}
                <span className="h-3 flex items-center justify-center" aria-hidden="true">
                  {cell.inCurrentMonth && status === 'clean' && (
                    <Check
                      className={`w-3 h-3 stroke-[2.6] ${
                        isSelected ? 'text-[#fffdf9]' : 'text-[#c2652a]'
                      }`}
                    />
                  )}
                  {cell.inCurrentMonth && status === 'relapse' && (
                    <RotateCcw
                      className={`w-2.5 h-2.5 stroke-[2.4] ${
                        isSelected ? 'text-[#fffdf9]' : 'text-[#8c3c3c]'
                      }`}
                    />
                  )}
                  {cell.inCurrentMonth && status === null && cell.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d241e]/55" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Legend */}
        <div className="flex items-center justify-between gap-3 flex-wrap mt-3.5 text-[11.5px] text-[#7c6d62]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-[#f8e6d8] border border-[#e6c4aa] inline-flex items-center justify-center text-[#c2652a]">
                <Check className="w-2.5 h-2.5 stroke-[2.6]" aria-hidden="true" />
              </span>
              <span>Clean day</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-[#f5e1e1] border border-dashed border-[#dfb8b8] inline-flex items-center justify-center text-[#8c3c3c]">
                <RotateCcw className="w-2.5 h-2.5 stroke-[2.4]" aria-hidden="true" />
              </span>
              <span>Relapse / reset</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-[#faf6f0] border border-[#d8d0c8]/80 inline-block" />
              <span>Unlogged</span>
            </span>
          </div>
          <span className="text-[11px] text-[#938477]">Select any day to inspect or update</span>
        </div>
      </div>

      {/* Selected Day Inspection & Quick Update Tray */}
      <div
        className="rounded-2xl bg-[#f5efe6] border border-[#e6ddd1] p-4 space-y-3"
        data-testid="calendar-selected-detail"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-semibold text-[#2d241e]">
              {formatLongDate(selectedDateKey)}
              {selectedDateKey === todayKey && (
                <span className="ml-2 text-[11px] font-semibold text-[#c2652a]">· Today</span>
              )}
            </div>
            <div className="text-xs text-[#6b5d53] mt-0.5">
              {selectedEntry?.status === 'clean' ? (
                <span className="inline-flex items-center gap-1 font-medium text-[#b45a22]">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Logged Clean</span>
                </span>
              ) : selectedEntry?.status === 'relapse' ? (
                <span className="inline-flex items-center gap-1 font-medium text-[#8c3c3c]">
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Gentle Reset Logged</span>
                </span>
              ) : (
                <span>No check-in logged for this day yet</span>
              )}
            </div>
          </div>

          {!isSelectedFuture && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onUpdateCalendarDay(selectedDateKey, 'clean')}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedEntry?.status === 'clean'
                    ? 'bg-[#c2652a] text-[#fffdf9]'
                    : 'bg-[#fffdf9] hover:bg-[#f9e8dc] text-[#b45a22] border border-[#e3cbb8]'
                }`}
              >
                Mark Clean
              </button>
              <button
                type="button"
                onClick={() => onUpdateCalendarDay(selectedDateKey, 'relapse')}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedEntry?.status === 'relapse'
                    ? 'bg-[#8c3c3c] text-[#fffdf9]'
                    : 'bg-[#fffdf9] hover:bg-[#f6e5e5] text-[#8c3c3c] border border-[#e2c6c6]'
                }`}
              >
                Log Relapse
              </button>
              {selectedEntry && (
                <button
                  type="button"
                  onClick={() => onUpdateCalendarDay(selectedDateKey, null)}
                  aria-label="Clear log for selected day"
                  className="min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#6b5d53] hover:bg-[#ebe1d4] inline-flex items-center gap-1 transition-colors"
                >
                  <Eraser className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          )}
        </div>

        {selectedEntry?.note && (
          <p className="text-xs leading-relaxed text-[#4a3e36] italic bg-[#fffdf9]/75 rounded-xl px-3.5 py-2.5 border border-[#e8dfd4]">
            &ldquo;{selectedEntry.note}&rdquo;
          </p>
        )}

        {/* Pattern Observation Strip */}
        <div className="pt-2.5 border-t border-[#e5dcd0] flex items-start gap-2 text-xs text-[#5c4f46] leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-[#c2652a] shrink-0 mt-0.5" aria-hidden="true" />
          <span data-testid="calendar-pattern-summary">{summary.patternSummary}</span>
        </div>
      </div>
    </section>
  );
}

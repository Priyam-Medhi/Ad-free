import { useState } from 'react';
import {
  AlarmClock,
  Award,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';
import { APP_IMAGES } from '../data/seedData';
import type { FocusSpace } from '../types/recovery';
import { formatSavedMetric } from '../utils/recoveryEngine';
import { WarmImage } from './BrandMark';
import { ProgressJourneyChart } from './ProgressJourneyChart';

interface TrackerScreenProps {
  space: FocusSpace;
  onCheckIn: (status: 'clean' | 'relapse', note?: string) => void;
  onUndoCheckIn: () => void;
  onAutomateRecommendation: () => void;
}

export function TrackerScreen({
  space,
  onCheckIn,
  onUndoCheckIn,
  onAutomateRecommendation,
}: TrackerScreenProps) {
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [relapseNote, setRelapseNote] = useState('');

  const savedMetric = formatSavedMetric(space);

  const handleConfirmRelapse = () => {
    onCheckIn('relapse', relapseNote);
    setRelapseNote('');
    setShowRelapseModal(false);
  };

  const streakLogSummary =
    space.streakDays >= 14
      ? `${space.streakDays} consecutive clean logs. Dopamine receptors stabilizing.`
      : space.streakDays >= 1
        ? `${space.streakDays} consecutive clean ${space.streakDays === 1 ? 'log' : 'logs'}. New neural pathways forming steadily.`
        : 'Fresh calm slate ready. Log your first clean day to begin your curve.';

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Top 2-Column Responsive Split on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Streak + Daily Commitment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Streak Banner Card */}
          <section
            aria-label="Active Streak Summary"
            className="rounded-[28px] bg-gradient-to-br from-[#f8efe4] via-[#f4e8da] to-[#f2e2d2] border border-[#d8d0c8]/55 p-6 shadow-sahara"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#f9dcc6] text-[#c2652a] inline-flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c2652a]">
                    Active Streak
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h1
                    className="font-serif text-[2.65rem] sm:text-[3rem] leading-none font-bold text-[#2d241e] tabular-nums"
                    data-testid="streak-days-value"
                  >
                    {space.streakDays} {space.streakDays === 1 ? 'Day' : 'Days'}
                  </h1>
                  <span className="font-serif text-lg text-[#6b5d53]">Free</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#6b5d53] mt-2.5 leading-relaxed">
                  {space.resilienceSubtitle}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/50 px-4 py-3.5 text-center shrink-0 min-w-[96px] shadow-sahara-sm">
                <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#87786c]">
                  Saved
                </div>
                <div
                  className="font-serif text-[1.45rem] font-bold text-[#c2652a] leading-tight mt-0.5 tabular-nums"
                  data-testid="saved-metric-value"
                >
                  {savedMetric.value}
                </div>
                <div className="text-[11px] text-[#6b5d53] whitespace-nowrap">
                  {savedMetric.unit}
                </div>
              </div>
            </div>
          </section>

          {/* Daily Commitment Check-in Card */}
          <section
            aria-label="Daily Commitment Check-in"
            className="rounded-[28px] bg-[#fffdf9] border border-[#d8d0c8]/60 p-6 sm:p-7 shadow-sahara"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#7c6d62] mt-1">
                Daily Commitment
              </span>
              <span className="w-10 h-10 rounded-full bg-[#f9ebe0] text-[#c2652a] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>

            <h2 className="font-serif text-[1.65rem] sm:text-[1.85rem] leading-[1.2] font-semibold text-[#2d241e] mb-2.5">
              Today&apos;s Check-in: Did you keep yourself free from your addiction today?
            </h2>

            <p className="text-[13.5px] leading-[1.6] text-[#6b5d53] mb-6">
              Target: <strong className="font-semibold text-[#2d241e]">{space.name}</strong>.
              Mindful reflection creates long-term neural plasticity.
            </p>

            {space.checkedInToday === null ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onCheckIn('clean')}
                  className="min-h-[72px] rounded-2xl bg-[#c2652a] hover:bg-[#a85320] active:scale-[0.98] text-[#fffdf9] px-4 py-3.5 transition-all flex flex-col items-center justify-center text-center shadow-sahara-sm"
                >
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold leading-tight">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Yes, Kept Free</span>
                  </span>
                  <span className="text-[11px] text-[#fae6d7] mt-1">Strengthen streak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRelapseModal(true)}
                  className="min-h-[72px] rounded-2xl bg-[#f3ece1] hover:bg-[#ebe1d3] active:scale-[0.98] text-[#2d241e] px-4 py-3.5 transition-all flex flex-col items-center justify-center text-center border border-[#d8d0c8]/50"
                >
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold leading-tight">
                    <RotateCcw className="w-4 h-4 text-[#6b5d53] shrink-0" aria-hidden="true" />
                    <span>No, Relapsed</span>
                  </span>
                  <span className="text-[11px] text-[#7c6d62] mt-1">Gentle safe reset</span>
                </button>
              </div>
            ) : (
              <div
                className={`rounded-2xl p-4 border ${
                  space.checkedInToday === 'clean'
                    ? 'bg-[#f9efe5] border-[#e6cbb5]'
                    : 'bg-[#f6eaea] border-[#e4cccc]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        space.checkedInToday === 'clean'
                          ? 'bg-[#c2652a] text-[#fffdf9]'
                          : 'bg-[#8c3c3c] text-[#fffdf9]'
                      }`}
                    >
                      {space.checkedInToday === 'clean' ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#2d241e]">
                        {space.checkedInToday === 'clean'
                          ? `Day ${space.streakDays} logged clean`
                          : 'Gentle reset logged with care'}
                      </p>
                      <p className="text-xs text-[#6b5d53] mt-0.5 leading-relaxed">
                        {space.checkedInToday === 'clean'
                          ? 'Another quiet victory wired into your nervous system.'
                          : 'Slip-ups are data, never defeat. Your lifetime clean days remain honored.'}
                      </p>
                      {space.lastCheckInNote && (
                        <p className="text-xs italic text-[#5c4f46] mt-1.5">
                          Note: “{space.lastCheckInNote}”
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onUndoCheckIn}
                    aria-label="Undo today's check-in"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#6b5d53] hover:text-[#2d241e] px-2.5 py-1.5 rounded-lg hover:bg-[#fffdf9]/70 transition-colors shrink-0"
                  >
                    <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Undo</span>
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Progress Journey Chart + AI Pattern Analysis */}
        <div className="lg:col-span-7 space-y-6">
          {/* Milestone Track / Progress Journey */}
          <section
            aria-label="Progress Journey"
            className="rounded-[28px] bg-[#fffdf9] border border-[#d8d0c8]/60 p-6 sm:p-7 shadow-sahara"
          >
            <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#7c6d62]">
                  Milestone Track
                </span>
                <h2 className="font-serif text-[1.6rem] sm:text-[1.75rem] leading-tight font-semibold text-[#2d241e] mt-0.5">
                  Progress Journey
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#6b5d53]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c2652a]" aria-hidden="true" />
                  <span>Clean Day</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d3c8bc]" aria-hidden="true" />
                  <span>Urge baseline</span>
                </span>
              </div>
            </div>

            <ProgressJourneyChart history={space.history} />

            <div className="mt-4 rounded-2xl bg-[#f5efe6] px-4 py-3.5 flex items-center gap-3 text-[13px] text-[#5c4f46]">
              <Award className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
              <span>{streakLogSummary}</span>
            </div>
          </section>

          {/* AI Pattern Analysis Card */}
          <section
            aria-label="AI Pattern Analysis"
            className="rounded-[28px] bg-[#f3ece1] border border-[#d8d0c8]/55 p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[#f8e4d3] text-[#c2652a] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2 className="font-serif text-[1.45rem] font-semibold text-[#2d241e]">
                  AI Pattern Analysis
                </h2>
              </div>
              <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#7c6d62] bg-[#e9dfd2] px-3 py-1 rounded-full whitespace-nowrap">
                Adaptive Engine
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Pattern Detected */}
              <div className="rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/50 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8c3c3c] mb-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pattern Detected</span>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-[#4a3e36]">
                  {space.patternInsight.detectedDescription.includes(
                    space.patternInsight.detectedWindow
                  ) ? (
                    <>
                      {space.patternInsight.detectedDescription.split(
                        space.patternInsight.detectedWindow
                      )[0]}
                      <strong className="font-semibold text-[#2d241e]">
                        {space.patternInsight.detectedWindow}
                      </strong>
                      {space.patternInsight.detectedDescription.split(
                        space.patternInsight.detectedWindow
                      )[1]}
                    </>
                  ) : (
                    space.patternInsight.detectedDescription
                  )}
                </p>
              </div>

              {/* AI Smart Recommendation */}
              <div className="rounded-2xl bg-[#f9eee4] border border-[#ebd6c4]/70 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#c2652a] mb-1.5">
                  <Brain className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>AI Smart Recommendation</span>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-[#4a3e36] mb-4">
                  {space.patternInsight.recommendation}
                </p>

                {space.patternInsight.automated ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fffdf9] border border-[#d8b89f] text-xs font-semibold text-[#a6521e]">
                    <CheckCircle2 className="w-4 h-4 text-[#c2652a]" aria-hidden="true" />
                    <span>Scheduled &amp; added to Growth Non-negotiables</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onAutomateRecommendation}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-[13px] font-medium transition-colors shadow-sahara-sm"
                  >
                    <AlarmClock className="w-4 h-4" aria-hidden="true" />
                    <span>{space.patternInsight.actionLabel}</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Two Mindful Visual Cards — unified responsive 2-column row */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
        <article className="rounded-[24px] bg-[#fffdf9] border border-[#d8d0c8]/55 p-3 sm:p-4 shadow-sahara flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="aspect-[4/3] sm:w-44 sm:shrink-0 overflow-hidden rounded-2xl">
            <WarmImage
              src={APP_IMAGES.mindfulAnchor}
              alt="Warm bedside lamp illuminating an open physical book"
              fallbackTitle="Mindful Anchor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-0.5">
            <h3 className="font-serif text-[1.1rem] sm:text-[1.3rem] font-semibold text-[#2d241e]">
              Mindful Anchor
            </h3>
            <p className="text-[11.5px] sm:text-[13px] leading-relaxed text-[#6b5d53] mt-0.5">
              Physical book replacement by the pillowcase.
            </p>
          </div>
        </article>

        <article className="rounded-[24px] bg-[#fffdf9] border border-[#d8d0c8]/55 p-3 sm:p-4 shadow-sahara flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="aspect-[4/3] sm:w-44 sm:shrink-0 overflow-hidden rounded-2xl">
            <WarmImage
              src={APP_IMAGES.calmHorizon}
              alt="Sunlit oak desk with open cream journal and stoneware coffee cup"
              fallbackTitle="Calm Horizon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-0.5">
            <h3 className="font-serif text-[1.1rem] sm:text-[1.3rem] font-semibold text-[#2d241e]">
              Calm Horizon
            </h3>
            <p className="text-[11.5px] sm:text-[13px] leading-relaxed text-[#6b5d53] mt-0.5">
              Waking up unplugged yields 2x mental clarity.
            </p>
          </div>
        </article>
      </div>

      {/* Gentle Safe Reset Modal */}
      {showRelapseModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2d241e]/40 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gentle-reset-title"
        >
          <div className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] bg-[#faf5ee] border border-[#d8d0c8] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#8c3c3c]">
                  Zero Judgment
                </span>
                <h3
                  id="gentle-reset-title"
                  className="font-serif text-2xl font-semibold text-[#2d241e] mt-0.5"
                >
                  Gentle Safe Reset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRelapseModal(false)}
                aria-label="Close gentle reset dialog"
                className="w-10 h-10 rounded-full hover:bg-[#efe7dc] flex items-center justify-center text-[#6b5d53]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[#6b5d53] mb-4">
              Recovery is non-linear. Logging honestly resets your current streak to Day 0 while
              keeping all {space.totalCleanDays} of your clean days recorded. What triggered the
              moment?
            </p>

            <label htmlFor="relapse-note" className="block text-xs font-medium text-[#5c4f46] mb-1.5">
              Optional reflection note
            </label>
            <textarea
              id="relapse-note"
              rows={3}
              value={relapseNote}
              onChange={(e) => setRelapseNote(e.target.value)}
              placeholder="e.g., Tired after 10 PM, picked up phone without noticing..."
              className="w-full rounded-2xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] p-3 text-sm text-[#2d241e] placeholder:text-[#9c8e82] focus:outline-none mb-5"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRelapseModal(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#d8d0c8] text-sm font-medium text-[#5c4f46] hover:bg-[#f3ece1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRelapse}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8c3c3c] hover:bg-[#743030] text-[#fffdf9] text-sm font-medium"
              >
                Log Gentle Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

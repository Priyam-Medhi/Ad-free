import { useState, type FormEvent } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Hourglass,
  Lock,
  PartyPopper,
  PiggyBank,
  Plus,
  Sparkles,
  Star,
  Wallet,
  X,
} from 'lucide-react';
import { REWARD_IMAGE_PRESETS } from '../data/seedData';
import type { FocusSpace } from '../types/recovery';
import { computeRewardMetrics, type AddRewardInput } from '../utils/recoveryEngine';
import { WarmImage } from './BrandMark';

interface RewardsScreenProps {
  space: FocusSpace;
  onRedeemReward: (rewardId: string) => void;
  onAddReward: (input: AddRewardInput) => void;
}

export function RewardsScreen({
  space,
  onRedeemReward,
  onAddReward,
}: RewardsScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [targetDays, setTargetDays] = useState('21');
  const [budget, setBudget] = useState('85');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(REWARD_IMAGE_PRESETS[0].id);
  const [formError, setFormError] = useState<string | null>(null);
  const [recentlyClaimedTitle, setRecentlyClaimedTitle] = useState<string | null>(null);

  const metrics = computeRewardMetrics(space);

  const handleClaim = (rewardId: string, rewardTitle: string) => {
    onRedeemReward(rewardId);
    setRecentlyClaimedTitle(rewardTitle);
  };

  const handleCreateSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    const parsedDays = Number(targetDays);
    const parsedBudget = Number(budget);

    if (!trimmed) {
      setFormError('Please name your reward milestone.');
      return;
    }
    if (!Number.isFinite(parsedDays) || parsedDays < 1) {
      setFormError('Target days clean must be at least 1.');
      return;
    }
    if (!Number.isFinite(parsedBudget) || parsedBudget < 5) {
      setFormError('Budget must be at least $5.');
      return;
    }

    const preset =
      REWARD_IMAGE_PRESETS.find((item) => item.id === selectedPresetId) ?? REWARD_IMAGE_PRESETS[0];

    onAddReward({
      title: trimmed,
      subtitle: subtitle.trim() || undefined,
      targetDays: parsedDays,
      budget: parsedBudget,
      imageUrl: preset.url,
      imageAlt: preset.alt,
    });

    setTitle('');
    setSubtitle('');
    setTargetDays('21');
    setBudget('85');
    setFormError(null);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-7">
      {/* Header + Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-5">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#c2652a]">
            Milestones &amp; Joys
          </span>
          <h1 className="font-serif text-[2.2rem] sm:text-[2.6rem] leading-[1.12] font-bold text-[#2d241e] mt-1 mb-2.5">
            Reward Your Freedom
          </h1>
          <p className="text-[14.5px] leading-[1.6] text-[#6b5d53]">
            Celebrate victories by investing your saved habit money into mindful rewards that bring
            enduring presence.
          </p>
        </div>

        {/* Stat Cards + Add CTA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {/* Habit Saved */}
            <div className="relative overflow-hidden rounded-[24px] bg-[#f3ece1] border border-[#d8d0c8]/55 p-5">
              <div
                className="pointer-events-none absolute -bottom-7 -right-7 w-20 h-20 rounded-full bg-[#e8ddd0]/70"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-[#6b5d53]">Habit Saved</span>
                <PiggyBank className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
              </div>
              <div className="relative flex items-baseline gap-1.5">
                <span
                  className="font-serif text-[2rem] sm:text-[2.25rem] font-bold text-[#2d241e] leading-none tabular-nums"
                  data-testid="habit-saved-usd"
                >
                  ${metrics.habitSavedUsd}
                </span>
                <span className="text-xs font-semibold text-[#c2652a]">USD</span>
              </div>
              <p className="relative text-[11.5px] text-[#7c6d62] mt-2 tabular-nums">
                {space.streakDays} {space.streakDays === 1 ? 'day' : 'days'} clean @ $
                {space.dailyCostUsd}/day
              </p>
            </div>

            {/* Reward Budget */}
            <div className="relative overflow-hidden rounded-[24px] bg-[#f9e9db] border border-[#ebd3be]/70 p-5">
              <div
                className="pointer-events-none absolute -bottom-7 -right-7 w-20 h-20 rounded-full bg-[#f2d6be]/65"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-[#8b4a21]">Reward Budget</span>
                <Wallet className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
              </div>
              <div className="relative flex items-baseline gap-1.5">
                <span
                  className="font-serif text-[2rem] sm:text-[2.25rem] font-bold text-[#2d241e] leading-none tabular-nums"
                  data-testid="reward-pool-usd"
                >
                  ${metrics.totalPoolUsd}
                </span>
                <span className="text-xs font-semibold text-[#c2652a]">POOL</span>
              </div>
              <p className="relative text-[11.5px] text-[#b45a22] font-medium mt-2 tabular-nums">
                ${metrics.claimableTodayUsd} claimable today
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full min-h-[52px] rounded-2xl bg-[#c2652a] hover:bg-[#a85320] active:scale-[0.99] text-[#fffdf9] font-semibold text-[15px] flex items-center justify-center gap-2 transition-all shadow-sahara-sm"
          >
            <Plus className="w-4 h-4 rounded-full border border-[#fffdf9]/80 p-0.5" aria-hidden="true" />
            <span>Add Custom Reward</span>
          </button>
        </div>
      </div>

      {/* Gentle Claim Celebration Banner */}
      {recentlyClaimedTitle && (
        <div
          role="status"
          className="rounded-2xl bg-[#f8e7d8] border border-[#e3c2a6] px-5 py-3.5 flex items-center justify-between gap-3 text-sm text-[#5c361a]"
        >
          <div className="flex items-center gap-2.5">
            <PartyPopper className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
            <span>
              <strong>{recentlyClaimedTitle}</strong> redeemed. Savor the presence you earned.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRecentlyClaimedTitle(null)}
            aria-label="Dismiss redemption banner"
            className="text-xs font-semibold text-[#a6521e] hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Vision Board Header */}
      <section aria-label="Your Vision Board" className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-[#6b5d53]">
              Your Vision Board
            </h2>
            <span
              className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-[#e9e0d5] text-xs font-semibold text-[#5c4f46] tabular-nums"
              data-testid="vision-board-count"
            >
              {metrics.items.length}
            </span>
          </div>
          <span className="text-xs text-[#6b5d53] tabular-nums">
            Clean streak:{' '}
            <strong className="font-semibold text-[#c2652a]">
              {space.streakDays} {space.streakDays === 1 ? 'Day' : 'Days'}
            </strong>
          </span>
        </div>

        {/* Vision Board Grid — 1-col on mobile matching reference, 3-col editorial grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {metrics.items.map((entry) => {
            const { reward, progressPercent, daysCompleted, isReady, savingsMatched, unlockDateLabel } =
              entry;

            const badgeContent = reward.redeemed
              ? { label: 'REDEEMED', style: 'bg-[#2d241e]/85 text-[#faf5ee]', icon: CheckCircle2 }
              : isReady
                ? { label: 'TARGET MET!', style: 'bg-[#c2652a] text-[#fffdf9]', icon: Star }
                : reward.targetDays >= 60
                  ? { label: 'LONG-TERM DREAM', style: 'bg-[#fffdf9]/92 text-[#5c4f46]', icon: Hourglass }
                  : { label: 'IN PROGRESS', style: 'bg-[#fffdf9]/92 text-[#c2652a]', icon: Clock };

            const BadgeIcon = badgeContent.icon;

            return (
              <article
                key={reward.id}
                className="flex flex-col overflow-hidden rounded-[28px] bg-[#fffdf9] border border-[#d8d0c8]/60 shadow-sahara"
              >
                {/* Warm Full-Bleed Top Image with Soft White Bottom Dissolve */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#efe7dc]">
                  <WarmImage
                    src={reward.imageUrl}
                    alt={reward.imageAlt}
                    fallbackTitle={reward.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fffdf9] via-[#fffdf9]/60 to-transparent"
                    aria-hidden="true"
                  />
                  {/* Floating Status Tag & Budget Tag */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-[0.08em] uppercase shadow-xs ${badgeContent.style}`}
                    >
                      <BadgeIcon className="w-3 h-3" aria-hidden="true" />
                      <span>{badgeContent.label}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-[#fffdf9]/95 text-[#2d241e] text-xs font-semibold tabular-nums shadow-xs">
                      ${reward.budget} Budget
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 sm:px-6 pb-6 pt-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-[1.45rem] leading-[1.2] font-bold text-[#2d241e] mb-1.5">
                      {reward.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-[#6b5d53] mb-5">
                      {reward.subtitle}
                    </p>
                  </div>

                  {reward.redeemed ? (
                    <div className="rounded-2xl bg-[#f5efe6] border border-[#e3d9cc] px-4 py-3.5 flex items-center justify-between gap-2 text-xs font-semibold text-[#5c4f46]">
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c2652a]" aria-hidden="true" />
                        <span>Milestone Claimed &amp; Enjoyed</span>
                      </span>
                      <span className="text-[#c2652a] tabular-nums">${reward.budget}</span>
                    </div>
                  ) : isReady ? (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-[#f5efe6] px-4 py-3 flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center gap-2 font-medium text-[#2d241e] tabular-nums">
                          <Award className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
                          <span>
                            {daysCompleted} of {reward.targetDays} Days Complete (100%)
                          </span>
                        </span>
                        <span className="font-semibold text-[#c2652a]">Ready</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleClaim(reward.id, reward.title)}
                        className="w-full min-h-[48px] rounded-2xl bg-[#c2652a] hover:bg-[#a85320] active:scale-[0.99] text-[#fffdf9] text-xs font-bold tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all shadow-sahara-sm"
                      >
                        <PartyPopper className="w-4 h-4" aria-hidden="true" />
                        <span>Claim &amp; Redeem ${reward.budget}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs tabular-nums">
                        <span className="text-[#5c4f46] font-medium">
                          {daysCompleted} / {reward.targetDays} Days clean
                        </span>
                        <span
                          className={`font-semibold ${
                            progressPercent >= 40 ? 'text-[#c2652a]' : 'text-[#6b5d53]'
                          }`}
                        >
                          {progressPercent}%
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-[#ede4d8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d48b5c] to-[#c2652a] transition-all duration-300"
                          style={{ width: `${Math.max(4, progressPercent)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11.5px] text-[#7c6d62] pt-1 tabular-nums">
                        <span className="inline-flex items-center gap-1.5">
                          {reward.targetDays >= 60 ? (
                            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                          <span>Unlocks {unlockDateLabel}</span>
                        </span>
                        <span>
                          Savings matched:{' '}
                          <strong className="font-semibold text-[#5c4f46]">
                            ${savingsMatched} / ${reward.budget}
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom Reflection Quote Card */}
      <figure className="rounded-[28px] bg-[#f3ece1] border border-[#d8d0c8]/55 px-6 sm:px-10 py-8 text-center">
        <Sparkles className="w-5 h-5 text-[#7c6d62] mx-auto mb-3" aria-hidden="true" />
        <blockquote className="font-serif italic text-[1.2rem] sm:text-[1.35rem] leading-[1.55] text-[#4a3e36] max-w-2xl mx-auto">
          &ldquo;The money you once spent seeking distraction now builds the tangible world you
          actually want to inhabit.&rdquo;
        </blockquote>
        <figcaption className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#87786c] mt-4">
          The Art of Recovery
        </figcaption>
      </figure>

      {/* Add Custom Reward Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2d241e]/40 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-reward-modal-title"
        >
          <div className="w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] bg-[#faf5ee] border border-[#d8d0c8] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c2652a]">
                  Vision Board
                </span>
                <h3
                  id="add-reward-modal-title"
                  className="font-serif text-2xl font-semibold text-[#2d241e]"
                >
                  Add Custom Reward
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close custom reward modal"
                className="w-10 h-10 rounded-full hover:bg-[#efe7dc] flex items-center justify-center text-[#6b5d53]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="reward-title" className="block text-xs font-semibold text-[#5c4f46] mb-1.5">
                  Reward Title
                </label>
                <input
                  id="reward-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g., Ceramic Pour-Over Kettle"
                  className="w-full rounded-xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] px-3.5 py-2.5 text-sm text-[#2d241e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reward-days"
                    className="block text-xs font-semibold text-[#5c4f46] mb-1.5"
                  >
                    Milestone (Days Clean)
                  </label>
                  <input
                    id="reward-days"
                    type="number"
                    min={1}
                    value={targetDays}
                    onChange={(e) => setTargetDays(e.target.value)}
                    className="w-full rounded-xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] px-3.5 py-2.5 text-sm text-[#2d241e] tabular-nums focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reward-budget"
                    className="block text-xs font-semibold text-[#5c4f46] mb-1.5"
                  >
                    Budget (USD)
                  </label>
                  <input
                    id="reward-budget"
                    type="number"
                    min={5}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] px-3.5 py-2.5 text-sm text-[#2d241e] tabular-nums focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reward-subtitle"
                  className="block text-xs font-semibold text-[#5c4f46] mb-1.5"
                >
                  Intention (optional)
                </label>
                <input
                  id="reward-subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g., Slow tactile mornings without screens"
                  className="w-full rounded-xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] px-3.5 py-2.5 text-sm text-[#2d241e] focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#5c4f46] mb-2">
                  Editorial Imagery
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {REWARD_IMAGE_PRESETS.map((preset) => {
                    const selected = preset.id === selectedPresetId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPresetId(preset.id)}
                        aria-label={`Select ${preset.label} photo`}
                        aria-pressed={selected}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selected
                            ? 'border-[#c2652a] ring-2 ring-[#c2652a]/25'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <WarmImage
                          src={preset.url}
                          alt={preset.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs text-[#8c3c3c] font-medium">
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#d8d0c8] text-sm font-medium text-[#5c4f46] hover:bg-[#f3ece1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-sm font-semibold"
                >
                  Save to Vision Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Moon,
  Plus,
  Sparkles,
} from 'lucide-react';
import { HABIT_ARCHETYPES } from '../data/seedData';
import type { FocusSpace } from '../types/recovery';
import { BrandMark, HabitIcon } from './BrandMark';

interface FocusSpacesScreenProps {
  spaces: FocusSpace[];
  activeSpaceId: string;
  onSelectSpace: (spaceId: string) => void;
  onCreateSpace: (name: string, archetypeId?: string) => void;
}

export function FocusSpacesScreen({
  spaces,
  activeSpaceId,
  onSelectSpace,
  onCreateSpace,
}: FocusSpacesScreenProps) {
  const [customHabit, setCustomHabit] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCustomSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = customHabit.trim();
    if (!trimmed) {
      setFormError('Enter a habit name (for example, Caffeine or Late-Night News) to begin.');
      return;
    }
    setFormError(null);
    onCreateSpace(trimmed);
    setCustomHabit('');
  };

  const sanctuaryCountLabel = `${spaces.length} Active ${spaces.length === 1 ? 'Sanctuary' : 'Sanctuaries'}`;

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#2d241e] flex flex-col">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-12 flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3 min-w-0">
            <BrandMark size="md" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#6b5d53] whitespace-nowrap">
              Your Focus Spaces
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ebe0] text-xs font-medium text-[#5c4f46] whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#c2652a]" aria-hidden="true" />
            <span>{sanctuaryCountLabel}</span>
          </div>
        </header>

        {/* Main Responsive Editorial Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start flex-1">
          {/* Left Column: Hero + Active Sanctuaries */}
          <section className="lg:col-span-7 flex flex-col">
            <div className="mb-8">
              <h1 className="font-serif text-[2.35rem] sm:text-[2.85rem] lg:text-[3.35rem] leading-[1.12] tracking-[-0.015em] text-[#2d241e] mb-4">
                What habit do you want to{' '}
                <em className="italic text-[#c2652a] font-normal">gently unbind</em> today?
              </h1>
              <p className="text-[15px] sm:text-base leading-[1.65] text-[#6b5d53] max-w-xl">
                Every focus space is completely sovereign. No shared triggers, no pressure—just
                quiet, dedicated pacing for your personal recovery.
              </p>
            </div>

            <div className="space-y-5" data-testid="active-spaces-list">
              {spaces.map((space) => {
                const isSelected = space.id === activeSpaceId;
                return (
                  <article
                    key={space.id}
                    className={`relative overflow-hidden rounded-[28px] bg-[#fffdf9] border transition-colors p-6 sm:p-7 shadow-sahara ${
                      isSelected ? 'border-[#d8d0c8]/80' : 'border-[#d8d0c8]/50'
                    }`}
                  >
                    {/* Subtle sun-baked corner wash behind Day indicator */}
                    <div
                      className="pointer-events-none absolute -top-12 -right-10 w-44 h-44 rounded-full bg-[#f7efe4]/80"
                      aria-hidden="true"
                    />

                    <div className="relative flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-[#f9e8dc] text-[#c2652a] flex items-center justify-center shrink-0 mt-0.5">
                          <HabitIcon icon={space.icon} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap mb-1">
                            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c2652a]">
                              Active Space
                            </span>
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f9ebe0] text-[#b45d28]">
                              Isolated
                            </span>
                          </div>
                          <h2 className="font-serif text-[1.65rem] sm:text-[1.85rem] leading-[1.18] font-medium text-[#2d241e]">
                            {space.name}
                          </h2>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <div className="font-serif text-[1.85rem] sm:text-[2.1rem] leading-none text-[#c2652a] tabular-nums">
                          Day {space.streakDays}
                        </div>
                        <div className="text-xs text-[#6b5d53] mt-1 leading-tight">
                          Clean &amp;
                          <br />
                          Present
                        </div>
                      </div>
                    </div>

                    {/* Ritual Highlight Strip */}
                    <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-[#f5efe6] px-4 py-3 mb-5">
                      <div className="flex items-center gap-2.5 min-w-0 text-[13px] text-[#5c4f46]">
                        <Moon className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
                        <span className="truncate">{space.ritualHighlight}</span>
                      </div>
                      <CheckCircle2
                        className="w-4 h-4 text-[#c2652a] shrink-0"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Primary CTA */}
                    <button
                      type="button"
                      onClick={() => onSelectSpace(space.id)}
                      className="relative w-full min-h-[54px] px-5 py-3.5 rounded-2xl bg-[#c2652a] hover:bg-[#a85320] active:scale-[0.99] text-[#fffdf9] font-medium text-[15px] transition-all flex items-center justify-between gap-3 shadow-sahara-sm"
                    >
                      <span className="text-left leading-snug">
                        Continue with {space.name}
                      </span>
                      <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Mobile Branch Divider */}
          <div className="lg:hidden flex items-center gap-4 my-1" aria-hidden="true">
            <span className="h-px flex-1 bg-[#d8d0c8]/70" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#87786c]">
              Or Start Another Branch
            </span>
            <span className="h-px flex-1 bg-[#d8d0c8]/70" />
          </div>

          {/* Right Column: Add New Addiction / Habit Space */}
          <section className="lg:col-span-5 lg:mt-2">
            <div className="hidden lg:flex items-center gap-3 mb-4" aria-hidden="true">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#87786c]">
                Or Start Another Branch
              </span>
              <span className="h-px flex-1 bg-[#d8d0c8]/70" />
            </div>

            <div className="rounded-[28px] bg-[#f3ece1] border border-[#d8d0c8]/55 p-6 sm:p-7">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#fffdf9] text-[#c2652a] flex items-center justify-center shrink-0 shadow-sahara-sm">
                  <Plus className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-[1.6rem] sm:text-[1.75rem] leading-[1.2] font-medium text-[#2d241e] mb-2">
                    Add New Addiction / Habit Space
                  </h2>
                  <p className="text-[13.5px] leading-[1.6] text-[#6b5d53]">
                    Starting a new addiction creates an isolated fresh workspace with untouched
                    streaks, dedicated growth lists, and tailored AI recommendations.
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b5d53] mb-3.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c2652a]" aria-hidden="true" />
                  <span>Quick-start from thoughtful archetypes:</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-col gap-2.5 items-start">
                  {HABIT_ARCHETYPES.map((archetype) => (
                    <button
                      key={archetype.id}
                      type="button"
                      onClick={() => onCreateSpace(archetype.name, archetype.id)}
                      className="inline-flex items-center gap-2.5 min-h-[44px] px-4 py-2.5 rounded-full bg-[#fffdf9] hover:bg-[#fcf6ee] border border-[#d8d0c8]/60 hover:border-[#c2652a]/50 text-[13.5px] font-medium text-[#2d241e] transition-all shadow-sahara-sm"
                    >
                      <HabitIcon
                        icon={archetype.icon}
                        className="w-4 h-4 text-[#c2652a] shrink-0"
                      />
                      <span className="whitespace-nowrap">{archetype.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCustomSubmit} noValidate>
                <label htmlFor="custom-habit-input" className="sr-only">
                  Name a custom habit
                </label>
                <div className="flex items-center gap-2 rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/75 focus-within:border-[#c2652a] p-1.5 transition-colors shadow-sahara-sm">
                  <input
                    id="custom-habit-input"
                    type="text"
                    value={customHabit}
                    onChange={(e) => {
                      setCustomHabit(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Or name a habit (e.g., Caffeine)"
                    className="w-full min-w-0 bg-transparent px-2.5 py-2.5 text-[13.5px] text-[#2d241e] placeholder:text-[#9c8e82] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-sm font-medium whitespace-nowrap shrink-0 transition-colors"
                  >
                    <span>Begin</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {formError && (
                  <p role="alert" className="mt-2 text-xs text-[#8c3c3c] font-medium px-1">
                    {formError}
                  </p>
                )}
              </form>
            </div>
          </section>
        </main>

        {/* Quiet Privacy Footer */}
        <footer className="mt-10 pt-4 flex items-center justify-center gap-2 text-xs text-[#7c6d62]">
          <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>100% Offline &amp; Ad-Free Privacy. Zero judgment, anytime.</span>
        </footer>
      </div>
    </div>
  );
}

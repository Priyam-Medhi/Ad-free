import { useState, type FormEvent } from 'react';
import {
  ArrowLeftRight,
  Check,
  Lightbulb,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { AnchorCategory, AnchorItem, FocusSpace } from '../types/recovery';
import { computeHabitFlow } from '../utils/recoveryEngine';
import { AnchorIcon, BrandMark } from './BrandMark';

interface GrowthScreenProps {
  space: FocusSpace;
  onToggleAnchor: (anchorId: string) => void;
  onAddAnchor: (category: AnchorCategory, title: string, subtitle: string) => void;
  onMoveAnchor: (anchorId: string, targetCategory: AnchorCategory) => void;
  onRemoveAnchor: (anchorId: string) => void;
}

interface SectionConfig {
  category: AnchorCategory;
  title: string;
  tag: string;
  description: string;
  dotColor: string;
  tagBg: string;
  tagText: string;
  addBtnBg: string;
  addBtnText: string;
  subtitleAccent: string;
}

const SECTIONS: SectionConfig[] = [
  {
    category: 'non-negotiable',
    title: 'Non-negotiables',
    tag: 'Pillars',
    description: 'Anchor rituals that happen without debate. Guard these fiercely.',
    dotColor: 'bg-[#c2652a]',
    tagBg: 'bg-[#f8e6d8]',
    tagText: 'text-[#b55a22]',
    addBtnBg: 'bg-[#f9e8dc] hover:bg-[#f2dac8]',
    addBtnText: 'text-[#c2652a]',
    subtitleAccent: 'text-[#7c6d62]',
  },
  {
    category: 'todo',
    title: 'To-do List',
    tag: 'Actionable',
    description: 'Proactive intentional efforts to move your creative and personal needle today.',
    dotColor: 'bg-[#6b5d53]',
    tagBg: 'bg-[#ebe4da]',
    tagText: 'text-[#5c4f46]',
    addBtnBg: 'bg-[#f9e8dc] hover:bg-[#f2dac8]',
    addBtnText: 'text-[#c2652a]',
    subtitleAccent: 'text-[#7c6d62]',
  },
  {
    category: 'not-to-do',
    title: 'Not-to-do List',
    tag: 'Boundaries',
    description: 'Defensive walls against dopamine traps, mindless scrolling, and draining defaults.',
    dotColor: 'bg-[#8c3c3c]',
    tagBg: 'bg-[#f4e2e2]',
    tagText: 'text-[#8c3c3c]',
    addBtnBg: 'bg-[#f6e5e5] hover:bg-[#edd4d4]',
    addBtnText: 'text-[#8c3c3c]',
    subtitleAccent: 'text-[#8c3c3c]',
  },
];

export function GrowthScreen({
  space,
  onToggleAnchor,
  onAddAnchor,
  onMoveAnchor,
  onRemoveAnchor,
}: GrowthScreenProps) {
  const [addingCategory, setAddingCategory] = useState<AnchorCategory | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [openMoverId, setOpenMoverId] = useState<string | null>(null);

  const flow = computeHabitFlow(space.anchors);

  const openAddForm = (category: AnchorCategory) => {
    setAddingCategory(category);
    setNewTitle('');
    setNewSubtitle('');
    setFormError(null);
  };

  const handleAddSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!addingCategory) return;
    if (!newTitle.trim()) {
      setFormError('Please enter a short ritual or boundary name.');
      return;
    }
    onAddAnchor(addingCategory, newTitle.trim(), newSubtitle.trim());
    setAddingCategory(null);
    setNewTitle('');
    setNewSubtitle('');
    setFormError(null);
  };

  const renderAnchorCard = (item: AnchorItem, section: SectionConfig) => {
    const isMoverOpen = openMoverId === item.id;
    const otherCategories = SECTIONS.filter((s) => s.category !== item.category);

    return (
      <div
        key={item.id}
        className="rounded-[22px] bg-[#fffdf9] border border-[#d8d0c8]/55 px-4 py-4 shadow-sahara-sm transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={item.completed}
              aria-label={`Mark "${item.title}" as ${item.completed ? 'incomplete' : 'protected'}`}
              onClick={() => onToggleAnchor(item.id)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all border ${
                item.completed
                  ? section.category === 'not-to-do'
                    ? 'bg-[#8c3c3c] border-[#8c3c3c] text-[#fffdf9]'
                    : 'bg-[#c2652a] border-[#c2652a] text-[#fffdf9]'
                  : 'bg-[#ede5db] border-[#dcd2c7] text-transparent hover:border-[#c2652a]/60'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`text-[15px] font-medium leading-snug transition-colors ${
                  item.completed ? 'text-[#2d241e]' : 'text-[#2d241e]'
                }`}
              >
                {item.title}
              </p>
              <div
                className={`flex items-center gap-1.5 text-xs mt-1 ${section.subtitleAccent}`}
              >
                <AnchorIcon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.subtitle}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpenMoverId(isMoverOpen ? null : item.id)}
            aria-expanded={isMoverOpen}
            aria-label={`Move or edit "${item.title}"`}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isMoverOpen
                ? 'bg-[#c2652a] text-[#fffdf9]'
                : 'bg-[#f4eee5] hover:bg-[#ebe1d4] text-[#6b5d53]'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Inline Mover Controls */}
        {isMoverOpen && (
          <div className="mt-3.5 pt-3 border-t border-[#e8dfd4] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#87786c] mr-1">
              Move to:
            </span>
            {otherCategories.map((target) => (
              <button
                key={target.category}
                type="button"
                onClick={() => {
                  onMoveAnchor(item.id, target.category);
                  setOpenMoverId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#f5efe6] hover:bg-[#ebdfd1] text-xs font-medium text-[#2d241e] transition-colors"
              >
                {target.title}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onRemoveAnchor(item.id);
                setOpenMoverId(null);
              }}
              aria-label={`Remove "${item.title}"`}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#8c3c3c] hover:bg-[#f6e5e5] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Remove</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-7">
      {/* Daily Architecture Hero Card */}
      <section
        aria-label="Daily Architecture Overview"
        className="rounded-[28px] bg-[#f4ede3] border border-[#d8d0c8]/55 p-6 sm:p-7 shadow-sahara"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#c2652a]">
              Cultivating Clarity
            </span>
            <h1 className="font-serif text-[2rem] sm:text-[2.35rem] leading-[1.15] font-semibold text-[#2d241e] mt-1 mb-2.5">
              Daily Architecture
            </h1>
            <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#6b5d53]">
              Balance non-negotiables, proactive tasks, and mindful boundaries. Move items freely as
              your focus shifts.
            </p>
          </div>
          <BrandMark size="lg" className="bg-[#f7e5d5]" />
        </div>

        {/* Habit Flow Strip */}
        <div className="rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/55 px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#2d241e]">
            <Sparkles className="w-4 h-4 text-[#c2652a] shrink-0" aria-hidden="true" />
            <span data-testid="habit-flow-summary">
              Habit Flow:{' '}
              <strong className="font-semibold text-[#c2652a] tabular-nums">
                {flow.completed} / {flow.total} Anchors
              </strong>{' '}
              protected today
            </span>
          </div>
          <div
            className="rounded-xl bg-[#f1ebe2] px-3 py-1.5 text-center shrink-0"
            data-testid="habit-flow-percent"
          >
            <div className="text-xs font-bold text-[#5c4f46] leading-tight tabular-nums">
              {flow.percent}%
            </div>
            <div className="text-[10.5px] text-[#7c6d62] leading-tight">{flow.statusLabel}</div>
          </div>
        </div>
      </section>

      {/* Three Pillar Lists — 1-column on mobile, 3-column balanced editorial grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
        {SECTIONS.map((section) => {
          const items = space.anchors.filter((a) => a.category === section.category);
          const isAddingHere = addingCategory === section.category;

          return (
            <section
              key={section.category}
              aria-label={section.title}
              data-testid={`growth-section-${section.category}`}
              className="flex flex-col"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${section.dotColor}`}
                    aria-hidden="true"
                  />
                  <h2 className="font-serif text-[1.45rem] font-semibold text-[#2d241e] truncate">
                    {section.title}
                  </h2>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${section.tagBg} ${section.tagText}`}
                  >
                    {section.tag}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openAddForm(section.category)}
                  aria-label={`Add task to ${section.title}`}
                  className={`inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${section.addBtnBg} ${section.addBtnText}`}
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Add Task</span>
                </button>
              </div>

              <p className="text-[13px] leading-relaxed text-[#6b5d53] mb-4">
                {section.description}
              </p>

              {/* Inline Add Task Form */}
              {isAddingHere && (
                <form
                  onSubmit={handleAddSubmit}
                  className="mb-3.5 rounded-[22px] bg-[#fffdf9] border border-[#c2652a]/50 p-4 shadow-sahara-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#c2652a]">
                      New {section.title.replace(/ List$/, '')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddingCategory(null)}
                      aria-label="Cancel adding task"
                      className="text-[#7c6d62] hover:text-[#2d241e] p-1"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g., 10-min sunset walk without phone"
                    aria-label="Task title"
                    autoFocus
                    className="w-full rounded-xl bg-[#faf5ee] border border-[#d8d0c8] focus:border-[#c2652a] px-3 py-2 text-sm text-[#2d241e] placeholder:text-[#9c8e82] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="Short intent (optional, e.g., Evening anchor)"
                    aria-label="Task intent subtitle"
                    className="w-full rounded-xl bg-[#faf5ee] border border-[#d8d0c8] focus:border-[#c2652a] px-3 py-2 text-xs text-[#2d241e] placeholder:text-[#9c8e82] focus:outline-none"
                  />
                  {formError && (
                    <p role="alert" className="text-xs text-[#8c3c3c] font-medium">
                      {formError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAddingCategory(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6b5d53] hover:bg-[#f3ece1]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-xs font-semibold"
                    >
                      Save Anchor
                    </button>
                  </div>
                </form>
              )}

              {/* Task Items */}
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-[#d8d0c8] px-4 py-6 text-center text-xs text-[#87786c]">
                    No items in {section.title} yet. Tap &ldquo;+ Add Task&rdquo; or move an anchor
                    here.
                  </div>
                ) : (
                  items.map((item) => renderAnchorCard(item, section))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom Philosophy Note: The Rule of Three Anchors */}
      <aside className="rounded-[26px] bg-[#f3ece1] border border-[#d8d0c8]/55 p-5 sm:p-6 flex items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-[#f8e6d8] text-[#c2652a] flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#2d241e] mb-1">
            The Rule of Three Anchors
          </h3>
          <p className="text-[13.5px] leading-[1.6] text-[#5c4f46]">
            If a regular To-do becomes vital to your sanity, elevate it to a{' '}
            <strong className="font-semibold text-[#c2652a]">Non-negotiable</strong>. If a habit
            proves slippery, frame it as a strict boundary in{' '}
            <strong className="font-semibold text-[#8c3c3c]">Not-to-do</strong>.
          </p>
        </div>
      </aside>
    </div>
  );
}

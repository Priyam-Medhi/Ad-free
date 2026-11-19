import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Award,
  BarChart2,
  Brain,
  Check,
  ChevronsUpDown,
  Lock,
  Plus,
  RotateCcw,
  Sprout,
  X,
} from 'lucide-react';
import { APP_IMAGES } from '../data/seedData';
import type { FocusSpace, TabId } from '../types/recovery';
import { BrandMark, HabitIcon, WarmImage } from './BrandMark';

interface AppShellProps {
  activeTab: TabId;
  activeSpace: FocusSpace;
  spaces: FocusSpace[];
  onTabChange: (tab: TabId) => void;
  onSelectSpace: (spaceId: string) => void;
  onGoToSpaces: () => void;
  onUpdateDailyRate: (dailyCostUsd: number) => void;
  onResetDemoData: () => void;
  children: ReactNode;
}

const TABS: { id: TabId; label: string; icon: typeof BarChart2 }[] = [
  { id: 'tracker', label: 'Tracker', icon: BarChart2 },
  { id: 'growth', label: 'Growth', icon: Sprout },
  { id: 'rewards', label: 'Rewards', icon: Award },
  { id: 'insights', label: 'Insights', icon: Brain },
];

export function AppShell({
  activeTab,
  activeSpace,
  spaces,
  onTabChange,
  onSelectSpace,
  onGoToSpaces,
  onUpdateDailyRate,
  onResetDemoData,
  children,
}: AppShellProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [rateDraft, setRateDraft] = useState(String(activeSpace.dailyCostUsd));
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRateDraft(String(activeSpace.dailyCostUsd));
  }, [activeSpace.id, activeSpace.dailyCostUsd]);

  useEffect(() => {
    if (!switcherOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [switcherOpen]);

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? 'Tracker';

  const handleSaveRate = () => {
    const parsed = Number(rateDraft);
    if (Number.isFinite(parsed) && parsed >= 1) {
      onUpdateDailyRate(Math.round(parsed));
    }
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#2d241e] flex flex-col">
      {/* Top App Bar — 56px compact sticky on mobile, clean 3-zone bar on desktop */}
      <header className="sticky top-0 z-30 bg-[#faf5ee]/92 backdrop-blur-md border-b border-[#d8d0c8]/55">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-3 lg:gap-8">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={onGoToSpaces}
            aria-label="Return to Focus Spaces"
            className="flex items-center gap-2.5 text-left shrink-0 group min-h-[44px]"
          >
            <BrandMark size="sm" className="group-hover:bg-[#f2dbc6] transition-colors" />
            <div className="leading-none">
              <span className="block text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#7c6d62] whitespace-nowrap">
                Ad-Free
              </span>
              <span className="block font-serif text-[17px] font-bold text-[#2d241e] whitespace-nowrap mt-0.5">
                {activeTabLabel}
              </span>
            </div>
          </button>

          {/* Zone 2 (Desktop): Clean Horizontal Text Navigation */}
          <nav
            aria-label="Primary Workspace Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#6b5d53]"
          >
            <button
              type="button"
              onClick={onGoToSpaces}
              className="py-1.5 hover:text-[#2d241e] transition-colors whitespace-nowrap shrink-0"
            >
              Spaces
            </button>
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-[#c2652a] border-[#c2652a] font-semibold'
                      : 'border-transparent hover:text-[#2d241e]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Space Switcher + User Portrait Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative" ref={switcherRef}>
              <button
                type="button"
                onClick={() => setSwitcherOpen((prev) => !prev)}
                aria-expanded={switcherOpen}
                aria-haspopup="listbox"
                aria-label={`Switch active focus space: ${activeSpace.name}`}
                className="inline-flex items-center gap-2 min-h-[38px] px-3 sm:px-3.5 py-1.5 rounded-full bg-[#f2ebe0] hover:bg-[#eae0d2] border border-[#d8d0c8]/55 text-xs sm:text-[13px] font-medium text-[#2d241e] transition-colors max-w-[165px] sm:max-w-[210px]"
              >
                <span className="w-2 h-2 rounded-full bg-[#c2652a] shrink-0" aria-hidden="true" />
                <span className="truncate">{activeSpace.shortName}</span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-[#7c6d62] shrink-0" aria-hidden="true" />
              </button>

              {switcherOpen && (
                <div
                  role="listbox"
                  aria-label="Focus Spaces"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#fffdf9] border border-[#d8d0c8] shadow-lg p-2 z-40"
                >
                  <div className="px-2.5 py-1.5 text-[10.5px] font-bold tracking-[0.12em] uppercase text-[#87786c]">
                    Sovereign Spaces
                  </div>
                  <div className="space-y-1">
                    {spaces.map((item) => {
                      const selected = item.id === activeSpace.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            onSelectSpace(item.id);
                            setSwitcherOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                            selected
                              ? 'bg-[#f8e9dc] text-[#2d241e] font-semibold'
                              : 'hover:bg-[#f5efe6] text-[#5c4f46]'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <HabitIcon
                              icon={item.icon}
                              className="w-3.5 h-3.5 text-[#c2652a] shrink-0"
                            />
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="flex items-center gap-1.5 shrink-0 tabular-nums text-[11px] text-[#7c6d62]">
                            <span>Day {item.streakDays}</span>
                            {selected && <Check className="w-3.5 h-3.5 text-[#c2652a]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#efe7dc]">
                    <button
                      type="button"
                      onClick={() => {
                        setSwitcherOpen(false);
                        onGoToSpaces();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#c2652a] hover:bg-[#f9ebe0] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>All Focus Spaces / Add New</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Open sanctuary preferences"
              className="w-9 h-9 rounded-full overflow-hidden border border-[#d8d0c8] hover:border-[#c2652a] transition-colors shrink-0"
            >
              <WarmImage
                src={APP_IMAGES.avatarUser}
                alt="Sanctuary member portrait"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-14">
        {children}
      </main>

      {/* Fixed Mobile Bottom Tab Bar (64px height; combined with 56px header = 120px < 15% of 844px) */}
      <nav
        aria-label="Workspace Tabs"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#faf5ee]/95 backdrop-blur-md border-t border-[#d8d0c8]/65 pb-safe"
      >
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1 min-h-[48px] transition-colors ${
                  isActive ? 'text-[#c2652a]' : 'text-[#6b5d53] hover:text-[#2d241e]'
                }`}
              >
                <Icon className="w-[21px] h-[21px]" strokeWidth={isActive ? 2.2 : 1.75} aria-hidden="true" />
                <span className={`text-[11px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sanctuary Preferences Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2d241e]/40 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sanctuary-prefs-title"
        >
          <div className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] bg-[#faf5ee] border border-[#d8d0c8] p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#d8d0c8]">
                  <WarmImage
                    src={APP_IMAGES.avatarUser}
                    alt="Sanctuary member portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2
                    id="sanctuary-prefs-title"
                    className="font-serif text-xl font-bold text-[#2d241e]"
                  >
                    Sanctuary Preferences
                  </h2>
                  <p className="text-xs text-[#6b5d53]">{activeSpace.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                aria-label="Close sanctuary preferences"
                className="w-9 h-9 rounded-full hover:bg-[#efe7dc] flex items-center justify-center text-[#6b5d53]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#f3ece1] p-4 flex items-start gap-3 text-xs text-[#5c4f46] leading-relaxed">
              <Lock className="w-4 h-4 text-[#c2652a] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                All streaks, daily anchors, and reflections stay locally on this device. Zero ads,
                zero tracking.
              </span>
            </div>

            <div>
              <label
                htmlFor="daily-rate-input"
                className="block text-xs font-semibold text-[#5c4f46] mb-1.5"
              >
                Estimated Daily Savings Rate (USD / clean day)
              </label>
              <input
                id="daily-rate-input"
                type="number"
                min={1}
                value={rateDraft}
                onChange={(e) => setRateDraft(e.target.value)}
                className="w-full rounded-xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] px-3.5 py-2.5 text-sm text-[#2d241e] tabular-nums focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#e5dcd1]">
              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  setProfileOpen(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c3c3c] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Sanctuary Data</span>
              </button>

              <button
                type="button"
                onClick={handleSaveRate}
                className="min-h-[42px] px-5 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-sm font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

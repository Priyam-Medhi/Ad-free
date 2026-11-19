export type TabId = 'tracker' | 'growth' | 'rewards' | 'insights';
export type ViewMode = 'spaces' | 'workspace';

export type AnchorCategory = 'non-negotiable' | 'todo' | 'not-to-do';

export type HabitIconKey =
  | 'smartphone'
  | 'wind'
  | 'croissant'
  | 'gamepad'
  | 'shopping'
  | 'sparkles';

export type AnchorIconKey =
  | 'sun'
  | 'moon'
  | 'book'
  | 'droplet'
  | 'ban'
  | 'utensils'
  | 'wind'
  | 'heart'
  | 'clock'
  | 'sparkles';

export interface DailyLogPoint {
  dayIndex: number;
  dayLetter: string;
  label: string;
  status: 'clean' | 'relapse';
  /** 0 = Relapse, 50 = Mild urge, 100 = Free */
  freedomScore: number;
  /** Baseline urge stability curve (0-100) */
  urgeBaseline: number;
  note?: string;
}

export interface AnchorItem {
  id: string;
  category: AnchorCategory;
  title: string;
  subtitle: string;
  icon: AnchorIconKey;
  completed: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  subtitle: string;
  targetDays: number;
  budget: number;
  imageUrl: string;
  imageAlt: string;
  tierLabel: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export interface PatternInsight {
  detectedWindow: string;
  detectedDescription: string;
  recommendation: string;
  actionLabel: string;
  automated: boolean;
  automatedAnchorTitle: string;
  automatedAnchorSubtitle: string;
}

export interface CalendarDayEntry {
  date: string; // YYYY-MM-DD
  status: 'clean' | 'relapse';
  freedomScore?: number;
  note?: string;
}

export interface FocusSpace {
  id: string;
  name: string;
  shortName: string;
  icon: HabitIconKey;
  streakDays: number;
  totalCleanDays: number;
  dailyCostUsd: number;
  dailyHoursSaved: number;
  savedUnitLabel: string;
  savedDisplayMode: 'hours' | 'currency';
  rewardPoolBonusUsd: number;
  ritualHighlight: string;
  resilienceSubtitle: string;
  checkedInToday: 'clean' | 'relapse' | null;
  lastCheckInNote?: string;
  history: DailyLogPoint[];
  calendarLogs?: Record<string, CalendarDayEntry>;
  anchors: AnchorItem[];
  rewards: RewardItem[];
  patternInsight: PatternInsight;
  createdAt: string;
}

export interface MindfulQuote {
  id: string;
  text: string;
  author: string;
  source: string;
}

export interface VideoGuidance {
  id: string;
  title: string;
  badge: string;
  category: string;
  stats: string;
  duration: string;
  creatorInitials: string;
  creatorName: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  keyTakeaways: string[];
  suggestedAnchorTitle: string;
  suggestedAnchorSubtitle: string;
}

export interface CaseStudy {
  id: string;
  categoryTag: string;
  dayCount: number;
  title: string;
  summary: string;
  beforeLabel?: string;
  beforeValue?: string;
  afterLabel?: string;
  afterValue?: string;
  highlightNote?: string;
  ctaLabel: string;
  archived?: boolean;
  dailySchedule: { time: string; practice: string }[];
  keyLesson: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ArchetypeDefinition {
  id: string;
  name: string;
  shortName: string;
  icon: HabitIconKey;
  dailyCostUsd: number;
  dailyHoursSaved: number;
  savedUnitLabel: string;
  savedDisplayMode: 'hours' | 'currency';
  ritualHighlight: string;
  patternInsight: PatternInsight;
  starterAnchors: Omit<AnchorItem, 'id'>[];
}

export interface AppState {
  view: ViewMode;
  activeTab: TabId;
  activeSpaceId: string;
  spaces: FocusSpace[];
  quoteIndex: number;
  bookmarkedQuoteIds: string[];
  reflectionsByQuoteId: Record<string, string>;
}

import { APP_IMAGES, DEFAULT_REWARDS, HABIT_ARCHETYPES } from '../data/seedData';
import type {
  AnchorCategory,
  AnchorIconKey,
  AnchorItem,
  CalendarDayEntry,
  DailyLogPoint,
  FocusSpace,
  RewardItem,
} from '../types/recovery';
import { getTodayDateKey, resolveSpaceCalendarLogs } from './calendarUtils';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export function createShortHabitName(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return 'Focus Space';
  if (cleaned.length <= 16) return cleaned;
  const words = cleaned.split(/[\s/]+/).filter(Boolean);
  if (words.length >= 2 && words[words.length - 1].length <= 15) {
    return words[words.length - 1];
  }
  return `${cleaned.slice(0, 14)}…`;
}

export function createFocusSpace(rawName: string, archetypeId?: string): FocusSpace {
  const trimmedName = rawName.trim();
  if (!trimmedName) {
    throw new Error('Habit name is required to create a focus space.');
  }

  const archetype = archetypeId
    ? HABIT_ARCHETYPES.find((item) => item.id === archetypeId)
    : HABIT_ARCHETYPES.find((item) => item.name.toLowerCase() === trimmedName.toLowerCase());

  const uid = `space-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const starterAnchors: AnchorItem[] = archetype
    ? archetype.starterAnchors.map((anchor, index) => ({
        ...anchor,
        id: `${uid}-anc-${index + 1}`,
      }))
    : [
        {
          id: `${uid}-anc-1`,
          category: 'non-negotiable',
          title: 'Morning 10-minute grounding breath & walk',
          subtitle: 'Daily clarity anchor',
          icon: 'sun',
          completed: false,
        },
        {
          id: `${uid}-anc-2`,
          category: 'todo',
          title: `Note top trigger for ${trimmedName}`,
          subtitle: 'Self-awareness log',
          icon: 'book',
          completed: false,
        },
        {
          id: `${uid}-anc-3`,
          category: 'not-to-do',
          title: `Pause 90 seconds before acting on ${createShortHabitName(trimmedName)} urge`,
          subtitle: 'Mindful boundary',
          icon: 'ban',
          completed: false,
        },
      ];

  const starterRewards: RewardItem[] = DEFAULT_REWARDS.map((reward, index) => ({
    ...reward,
    id: `${uid}-rew-${index + 1}`,
    redeemed: false,
    redeemedAt: undefined,
  }));

  return {
    id: uid,
    name: trimmedName,
    shortName: archetype ? archetype.shortName : createShortHabitName(trimmedName),
    icon: archetype ? archetype.icon : 'sparkles',
    streakDays: 0,
    totalCleanDays: 0,
    dailyCostUsd: archetype ? archetype.dailyCostUsd : 10,
    dailyHoursSaved: archetype ? archetype.dailyHoursSaved : 1.5,
    savedUnitLabel: archetype ? archetype.savedUnitLabel : 'reclaimed',
    savedDisplayMode: archetype ? archetype.savedDisplayMode : 'hours',
    rewardPoolBonusUsd: 0,
    ritualHighlight: archetype
      ? archetype.ritualHighlight
      : 'Fresh sovereign sanctuary ready for Day 1',
    resilienceSubtitle: 'Fresh start • Sovereign pacing active',
    checkedInToday: null,
    history: [
      {
        dayIndex: 1,
        dayLetter: 'M',
        label: 'D1',
        status: 'clean',
        freedomScore: 52,
        urgeBaseline: 40,
      },
    ],
    calendarLogs: {},
    anchors: starterAnchors,
    rewards: starterRewards,
    patternInsight: archetype
      ? { ...archetype.patternInsight }
      : {
          detectedWindow: '8:30 PM – 10:30 PM',
          detectedDescription: `Early evening transition periods are common cue windows for ${trimmedName}.`,
          recommendation:
            'Design a calm 10-minute replacement ritual before your usual trigger window begins.',
          actionLabel: 'Add Evening Replacement Anchor',
          automated: false,
          automatedAnchorTitle: `10-min calm replacement ritual for ${createShortHabitName(trimmedName)}`,
          automatedAnchorSubtitle: 'Automated evening boundary',
        },
    createdAt: new Date().toISOString(),
  };
}

export function logDailyCheckIn(
  space: FocusSpace,
  status: 'clean' | 'relapse',
  note?: string,
  todayKey: string = getTodayDateKey()
): FocusSpace {
  const trimmedNote = note?.trim() || undefined;
  const nextDayIndex = space.history.length + 1;
  const dayLetter = DAY_LETTERS[(nextDayIndex - 1) % DAY_LETTERS.length];
  const existingLogs = resolveSpaceCalendarLogs(space, todayKey);

  if (status === 'clean') {
    // Prevent double-incrementing if already logged clean today
    if (space.checkedInToday === 'clean') {
      return {
        ...space,
        lastCheckInNote: trimmedNote ?? space.lastCheckInNote,
      };
    }

    const nextStreak = space.streakDays + 1;
    const nextTotal = space.totalCleanDays + 1;
    const lastPoint = space.history[space.history.length - 1];
    const nextFreedom = Math.min(100, (lastPoint?.freedomScore ?? 55) + 4);
    const nextBaseline = Math.min(99, (lastPoint?.urgeBaseline ?? 45) + 3);

    const newPoint: DailyLogPoint = {
      dayIndex: nextDayIndex,
      dayLetter,
      label: `D${nextStreak}`,
      status: 'clean',
      freedomScore: nextFreedom,
      urgeBaseline: nextBaseline,
      note: trimmedNote,
    };

    const nextHistory =
      space.streakDays === 0 && space.history.length === 1 && space.totalCleanDays === 0
        ? [{ ...newPoint, dayIndex: 1, label: 'D1' }]
        : [...space.history.slice(-13), newPoint];

    const updatedLogs: Record<string, CalendarDayEntry> = {
      ...existingLogs,
      [todayKey]: {
        date: todayKey,
        status: 'clean',
        freedomScore: nextFreedom,
        note: trimmedNote,
      },
    };

    return {
      ...space,
      streakDays: nextStreak,
      totalCleanDays: nextTotal,
      checkedInToday: 'clean',
      lastCheckInNote: trimmedNote,
      ritualHighlight: `Day ${nextStreak} check-in logged cleanly • Steady momentum`,
      resilienceSubtitle:
        nextStreak >= 14
          ? 'Mindful calm restored • Top 8% resilience'
          : nextStreak >= 7
            ? 'Neural pathways strengthening • Steady clarity'
            : 'Building calm momentum • One day at a time',
      history: nextHistory,
      calendarLogs: updatedLogs,
    };
  }

  // Gentle safe reset on relapse
  if (space.checkedInToday === 'relapse') {
    return {
      ...space,
      lastCheckInNote: trimmedNote ?? space.lastCheckInNote,
    };
  }

  const lastBaseline = space.history[space.history.length - 1]?.urgeBaseline ?? 50;
  const relapsePoint: DailyLogPoint = {
    dayIndex: nextDayIndex,
    dayLetter,
    label: 'Reset',
    status: 'relapse',
    freedomScore: 14,
    urgeBaseline: Math.max(25, lastBaseline - 18),
    note: trimmedNote,
  };

  const updatedLogs: Record<string, CalendarDayEntry> = {
    ...existingLogs,
    [todayKey]: {
      date: todayKey,
      status: 'relapse',
      freedomScore: 14,
      note: trimmedNote,
    },
  };

  return {
    ...space,
    streakDays: 0,
    checkedInToday: 'relapse',
    lastCheckInNote: trimmedNote,
    ritualHighlight: 'Gentle reset logged • Zero judgment, fresh grounding tomorrow',
    resilienceSubtitle: `${space.totalCleanDays} lifetime clean days preserved • Compassionate reset`,
    history: [...space.history.slice(-13), relapsePoint],
    calendarLogs: updatedLogs,
  };
}

export function undoTodayCheckIn(
  space: FocusSpace,
  todayKey: string = getTodayDateKey()
): FocusSpace {
  if (!space.checkedInToday) return space;
  const existingLogs = resolveSpaceCalendarLogs(space, todayKey);
  const { [todayKey]: _removed, ...restLogs } = existingLogs;

  if (space.checkedInToday === 'clean') {
    const revertedStreak = Math.max(0, space.streakDays - 1);
    const revertedTotal = Math.max(0, space.totalCleanDays - 1);
    const revertedHistory =
      space.history.length > 1 ? space.history.slice(0, -1) : space.history;
    return {
      ...space,
      streakDays: revertedStreak,
      totalCleanDays: revertedTotal,
      checkedInToday: null,
      lastCheckInNote: undefined,
      history: revertedHistory,
      calendarLogs: restLogs,
    };
  }

  const revertedHistory =
    space.history.length > 1 ? space.history.slice(0, -1) : space.history;
  return {
    ...space,
    checkedInToday: null,
    lastCheckInNote: undefined,
    history: revertedHistory,
    calendarLogs: restLogs,
  };
}

export function updateCalendarDayLog(
  space: FocusSpace,
  dateKey: string,
  status: 'clean' | 'relapse' | null,
  note?: string,
  todayKey: string = getTodayDateKey()
): FocusSpace {
  if (dateKey === todayKey) {
    if (status === null) {
      return undoTodayCheckIn(space, todayKey);
    }
    if (space.checkedInToday && space.checkedInToday !== status) {
      const undone = undoTodayCheckIn(space, todayKey);
      return logDailyCheckIn(undone, status, note, todayKey);
    }
    return logDailyCheckIn(space, status, note, todayKey);
  }

  const existingLogs = resolveSpaceCalendarLogs(space, todayKey);
  if (status === null) {
    const { [dateKey]: _removed, ...restLogs } = existingLogs;
    return {
      ...space,
      calendarLogs: restLogs,
    };
  }

  const existingEntry = existingLogs[dateKey];
  const trimmedNote = note !== undefined ? note.trim() || undefined : existingEntry?.note;

  return {
    ...space,
    calendarLogs: {
      ...existingLogs,
      [dateKey]: {
        date: dateKey,
        status,
        freedomScore: status === 'clean' ? 88 : 16,
        note: trimmedNote,
      },
    },
  };
}

export interface HabitFlowSummary {
  completed: number;
  total: number;
  percent: number;
  statusLabel: string;
}

export function computeHabitFlow(anchors: AnchorItem[]): HabitFlowSummary {
  const total = anchors.length;
  const completed = anchors.filter((item) => item.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  let statusLabel = 'Starting';
  if (total === 0) statusLabel = 'Open';
  else if (percent === 100) statusLabel = 'Protected';
  else if (percent >= 65) statusLabel = 'Solid';
  else if (percent >= 35) statusLabel = 'Building';

  return { completed, total, percent, statusLabel };
}

export function toggleAnchor(anchors: AnchorItem[], anchorId: string): AnchorItem[] {
  return anchors.map((item) =>
    item.id === anchorId ? { ...item, completed: !item.completed } : item
  );
}

export function addAnchor(
  anchors: AnchorItem[],
  category: AnchorCategory,
  title: string,
  subtitle: string,
  icon?: AnchorIconKey
): AnchorItem[] {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error('Anchor title is required.');
  }
  const defaultIcon: AnchorIconKey =
    category === 'non-negotiable' ? 'sun' : category === 'todo' ? 'book' : 'ban';
  const defaultSubtitle =
    category === 'non-negotiable'
      ? 'Daily pillar'
      : category === 'todo'
        ? 'Intentional step'
        : 'Protective boundary';

  const newAnchor: AnchorItem = {
    id: `anc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    category,
    title: trimmedTitle,
    subtitle: subtitle.trim() || defaultSubtitle,
    icon: icon ?? defaultIcon,
    completed: false,
  };

  return [...anchors, newAnchor];
}

export function moveAnchor(
  anchors: AnchorItem[],
  anchorId: string,
  targetCategory: AnchorCategory
): AnchorItem[] {
  return anchors.map((item) =>
    item.id === anchorId ? { ...item, category: targetCategory } : item
  );
}

export function removeAnchor(anchors: AnchorItem[], anchorId: string): AnchorItem[] {
  return anchors.filter((item) => item.id !== anchorId);
}

export interface ComputedRewardStatus {
  reward: RewardItem;
  progressPercent: number;
  daysCompleted: number;
  daysRemaining: number;
  isReady: boolean;
  savingsMatched: number;
  unlockDateLabel: string;
}

export interface RewardBudgetSummary {
  habitSavedUsd: number;
  totalPoolUsd: number;
  redeemedTotalUsd: number;
  claimableTodayUsd: number;
  items: ComputedRewardStatus[];
}

export function formatUnlockDate(daysRemaining: number, referenceDate = new Date(2026, 9, 12)): string {
  if (daysRemaining <= 0) return 'Unlocked';
  const target = new Date(referenceDate.getTime());
  target.setDate(target.getDate() + daysRemaining);
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function computeRewardMetrics(
  space: FocusSpace,
  referenceDate = new Date(2026, 9, 12)
): RewardBudgetSummary {
  const habitSavedUsd = Math.round(space.streakDays * space.dailyCostUsd);
  const redeemedTotalUsd = space.rewards
    .filter((r) => r.redeemed)
    .reduce((sum, r) => sum + r.budget, 0);

  const totalPoolUsd = Math.max(0, habitSavedUsd + space.rewardPoolBonusUsd - redeemedTotalUsd);

  const items: ComputedRewardStatus[] = space.rewards.map((reward) => {
    const daysCompleted = Math.min(space.streakDays, reward.targetDays);
    const daysRemaining = Math.max(0, reward.targetDays - space.streakDays);
    const progressPercent =
      reward.targetDays <= 0
        ? 100
        : Math.min(100, Math.floor((space.streakDays / reward.targetDays) * 100));
    const isReady = !reward.redeemed && space.streakDays >= reward.targetDays;
    const savingsMatched = Math.min(habitSavedUsd, reward.budget);

    return {
      reward,
      progressPercent,
      daysCompleted,
      daysRemaining,
      isReady,
      savingsMatched,
      unlockDateLabel: formatUnlockDate(daysRemaining, referenceDate),
    };
  });

  const claimableTodayUsd = items
    .filter((entry) => entry.isReady)
    .reduce((sum, entry) => sum + entry.reward.budget, 0);

  return {
    habitSavedUsd,
    totalPoolUsd,
    redeemedTotalUsd,
    claimableTodayUsd,
    items,
  };
}

export function redeemReward(space: FocusSpace, rewardId: string): FocusSpace {
  const target = space.rewards.find((item) => item.id === rewardId);
  if (!target || target.redeemed || space.streakDays < target.targetDays) {
    return space;
  }

  return {
    ...space,
    rewards: space.rewards.map((item) =>
      item.id === rewardId
        ? {
            ...item,
            redeemed: true,
            redeemedAt: new Date().toISOString(),
          }
        : item
    ),
  };
}

export interface AddRewardInput {
  title: string;
  subtitle?: string;
  targetDays: number;
  budget: number;
  imageUrl?: string;
  imageAlt?: string;
}

export function addCustomReward(space: FocusSpace, input: AddRewardInput): FocusSpace {
  const trimmedTitle = input.title.trim();
  if (!trimmedTitle) {
    throw new Error('Reward title is required.');
  }
  const safeTargetDays = Math.max(1, Math.round(input.targetDays));
  const safeBudget = Math.max(5, Math.round(input.budget));

  const tierLabel =
    space.streakDays >= safeTargetDays
      ? 'TARGET MET!'
      : safeTargetDays >= 60
        ? 'LONG-TERM DREAM'
        : 'IN PROGRESS';

  const newReward: RewardItem = {
    id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: trimmedTitle,
    subtitle:
      input.subtitle?.trim() ||
      `Milestone: ${safeTargetDays} Days Clean • Mindful personal reward`,
    targetDays: safeTargetDays,
    budget: safeBudget,
    imageUrl: input.imageUrl || APP_IMAGES.artisanDinner,
    imageAlt: input.imageAlt || trimmedTitle,
    tierLabel,
    redeemed: false,
  };

  return {
    ...space,
    rewards: [newReward, ...space.rewards],
  };
}

export function applySmartRecommendation(space: FocusSpace): FocusSpace {
  if (space.patternInsight.automated) return space;

  const alreadyHasAnchor = space.anchors.some(
    (anchor) =>
      anchor.title.toLowerCase() === space.patternInsight.automatedAnchorTitle.toLowerCase()
  );

  const nextAnchors = alreadyHasAnchor
    ? space.anchors
    : addAnchor(
        space.anchors,
        'non-negotiable',
        space.patternInsight.automatedAnchorTitle,
        space.patternInsight.automatedAnchorSubtitle,
        'moon'
      );

  return {
    ...space,
    anchors: nextAnchors,
    patternInsight: {
      ...space.patternInsight,
      automated: true,
    },
  };
}

export function formatSavedMetric(space: FocusSpace): { value: string; unit: string } {
  if (space.savedDisplayMode === 'hours') {
    const rawHours = space.streakDays * space.dailyHoursSaved;
    const rounded = Math.round(rawHours * 10) / 10;
    return {
      value: `${rounded}h`,
      unit: space.savedUnitLabel,
    };
  }
  const savedUsd = Math.round(space.streakDays * space.dailyCostUsd);
  return {
    value: `$${savedUsd}`,
    unit: space.savedUnitLabel,
  };
}

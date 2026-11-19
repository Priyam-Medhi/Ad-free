import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_DOOMSCROLLING_SPACE } from '../data/seedData';
import {
  addAnchor,
  addCustomReward,
  applySmartRecommendation,
  computeHabitFlow,
  computeRewardMetrics,
  createFocusSpace,
  formatSavedMetric,
  logDailyCheckIn,
  moveAnchor,
  redeemReward,
  removeAnchor,
  toggleAnchor,
  undoTodayCheckIn,
  updateCalendarDayLog,
} from './recoveryEngine';

test('initial seed space computes 4/6 anchors (67% Solid) and $140 saved / $200 pool / $60 claimable', () => {
  const flow = computeHabitFlow(INITIAL_DOOMSCROLLING_SPACE.anchors);
  assert.equal(flow.completed, 4);
  assert.equal(flow.total, 6);
  assert.equal(flow.percent, 67);
  assert.equal(flow.statusLabel, 'Solid');

  const rewards = computeRewardMetrics(INITIAL_DOOMSCROLLING_SPACE);
  assert.equal(rewards.habitSavedUsd, 140);
  assert.equal(rewards.totalPoolUsd, 200);
  assert.equal(rewards.claimableTodayUsd, 60);
  assert.equal(rewards.items[0].isReady, true);
  assert.equal(rewards.items[1].progressPercent, 46);
  assert.equal(rewards.items[2].progressPercent, 15);

  const saved = formatSavedMetric(INITIAL_DOOMSCROLLING_SPACE);
  assert.equal(saved.value, '28.5h');
  assert.equal(saved.unit, 'screen time');
});

test('logDailyCheckIn increments streak cleanly and avoids double-counting', () => {
  const afterClean = logDailyCheckIn(INITIAL_DOOMSCROLLING_SPACE, 'clean', 'Read before sleep');
  assert.equal(afterClean.streakDays, 15);
  assert.equal(afterClean.totalCleanDays, 15);
  assert.equal(afterClean.checkedInToday, 'clean');
  assert.equal(afterClean.history[afterClean.history.length - 1].label, 'D15');

  const afterDuplicate = logDailyCheckIn(afterClean, 'clean');
  assert.equal(afterDuplicate.streakDays, 15);

  const undone = undoTodayCheckIn(afterClean);
  assert.equal(undone.streakDays, 14);
  assert.equal(undone.checkedInToday, null);
});

test('logDailyCheckIn relapse gently resets current streak while preserving lifetime clean days', () => {
  const afterRelapse = logDailyCheckIn(
    INITIAL_DOOMSCROLLING_SPACE,
    'relapse',
    'Late work stress'
  );
  assert.equal(afterRelapse.streakDays, 0);
  assert.equal(afterRelapse.totalCleanDays, 14);
  assert.equal(afterRelapse.checkedInToday, 'relapse');
  assert.equal(afterRelapse.history[afterRelapse.history.length - 1].status, 'relapse');
});

test('createFocusSpace builds an isolated Day 0 space from archetype or custom habit name', () => {
  const nicotine = createFocusSpace('Nicotine / Vaping', 'nicotine');
  assert.equal(nicotine.streakDays, 0);
  assert.equal(nicotine.shortName, 'Nicotine');
  assert.equal(nicotine.dailyCostUsd, 12);
  assert.ok(nicotine.anchors.length >= 3);

  const caffeine = createFocusSpace('Caffeine');
  assert.equal(caffeine.name, 'Caffeine');
  assert.equal(caffeine.streakDays, 0);
  assert.equal(caffeine.anchors.length, 3);

  assert.throws(() => createFocusSpace('   '), /Habit name is required/);
});

test('growth anchors support toggle, add, move across categories, and remove', () => {
  const toggled = toggleAnchor(INITIAL_DOOMSCROLLING_SPACE.anchors, 'anc-4');
  assert.equal(computeHabitFlow(toggled).completed, 5);

  const added = addAnchor(toggled, 'non-negotiable', 'Evening stretch', 'Body release');
  assert.equal(added.length, 7);
  const newItem = added[added.length - 1];
  assert.equal(newItem.category, 'non-negotiable');

  const moved = moveAnchor(added, newItem.id, 'not-to-do');
  assert.equal(moved.find((a) => a.id === newItem.id)?.category, 'not-to-do');

  const removed = removeAnchor(moved, newItem.id);
  assert.equal(removed.length, 6);
});

test('redeemReward marks milestone redeemed and deducts from reward pool', () => {
  const redeemed = redeemReward(INITIAL_DOOMSCROLLING_SPACE, 'reward-artisan-dinner');
  const metrics = computeRewardMetrics(redeemed);
  assert.equal(metrics.items[0].reward.redeemed, true);
  assert.equal(metrics.claimableTodayUsd, 0);
  assert.equal(metrics.totalPoolUsd, 140);

  // Attempting to redeem an unreached reward is a no-op
  const unchanged = redeemReward(redeemed, 'reward-mountain-cabin');
  assert.equal(unchanged.rewards[1].redeemed, false);
});

test('addCustomReward validates title and adds to vision board', () => {
  const updated = addCustomReward(INITIAL_DOOMSCROLLING_SPACE, {
    title: 'Ceramic Pour-Over Kettle',
    targetDays: 21,
    budget: 95,
  });
  assert.equal(updated.rewards.length, 4);
  assert.equal(updated.rewards[0].title, 'Ceramic Pour-Over Kettle');

  assert.throws(
    () =>
      addCustomReward(INITIAL_DOOMSCROLLING_SPACE, {
        title: '  ',
        targetDays: 10,
        budget: 40,
      }),
    /Reward title is required/
  );
});

test('applySmartRecommendation activates automation and adds non-negotiable anchor once', () => {
  const automated = applySmartRecommendation(INITIAL_DOOMSCROLLING_SPACE);
  assert.equal(automated.patternInsight.automated, true);
  assert.equal(automated.anchors.length, INITIAL_DOOMSCROLLING_SPACE.anchors.length + 1);

  const repeated = applySmartRecommendation(automated);
  assert.equal(repeated.anchors.length, automated.anchors.length);
});

test('calendarLogs stay synchronized with daily check-in, undo, and past-day updates', () => {
  const today = '2026-11-18';
  const checked = logDailyCheckIn(INITIAL_DOOMSCROLLING_SPACE, 'clean', 'Calm night', today);
  assert.equal(checked.calendarLogs?.[today]?.status, 'clean');
  assert.equal(checked.calendarLogs?.[today]?.note, 'Calm night');

  const undone = undoTodayCheckIn(checked, today);
  assert.equal(undone.calendarLogs?.[today], undefined);

  const editedPast = updateCalendarDayLog(
    INITIAL_DOOMSCROLLING_SPACE,
    '2026-10-20',
    'relapse',
    'Late deadline scroll',
    today
  );
  assert.equal(editedPast.calendarLogs?.['2026-10-20']?.status, 'relapse');

  const clearedPast = updateCalendarDayLog(editedPast, '2026-10-20', null, undefined, today);
  assert.equal(clearedPast.calendarLogs?.['2026-10-20'], undefined);
});

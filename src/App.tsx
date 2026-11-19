import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { FocusSpacesScreen } from './components/FocusSpacesScreen';
import { GrowthScreen } from './components/GrowthScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { TrackerScreen } from './components/TrackerScreen';
import { createInitialAppState, MINDFUL_QUOTES } from './data/seedData';
import type { AnchorCategory, AppState, FocusSpace, TabId } from './types/recovery';
import {
  addAnchor,
  addCustomReward,
  applySmartRecommendation,
  createFocusSpace,
  logDailyCheckIn,
  moveAnchor,
  redeemReward,
  removeAnchor,
  toggleAnchor,
  undoTodayCheckIn,
  updateCalendarDayLog,
  type AddRewardInput,
} from './utils/recoveryEngine';

const STORAGE_KEY = 'adfree_sanctuary_state_v1';

function loadInitialState(): AppState {
  const base = createInitialAppState();
  if (typeof window === 'undefined') return base;

  let loaded = base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      if (Array.isArray(parsed.spaces) && parsed.spaces.length > 0) {
        loaded = {
          ...base,
          ...parsed,
          spaces: parsed.spaces,
          activeSpaceId:
            parsed.spaces.some((s) => s.id === parsed.activeSpaceId) && parsed.activeSpaceId
              ? parsed.activeSpaceId
              : parsed.spaces[0].id,
        };
      }
    }
  } catch {
    loaded = base;
  }

  // Honor ?autostart=1 or ?tab=tracker|growth|rewards|insights for direct navigation/testing
  const params = new URLSearchParams(window.location.search);
  const autostart = params.get('autostart') === '1';
  const requestedTab = params.get('tab') as TabId | null;
  const validTabs: TabId[] = ['tracker', 'growth', 'rewards', 'insights'];

  if (requestedTab && validTabs.includes(requestedTab)) {
    return { ...loaded, view: 'workspace', activeTab: requestedTab };
  }
  if (autostart) {
    return { ...loaded, view: 'workspace' };
  }

  return loaded;
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadInitialState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues in restricted environments
    }
  }, [state]);

  const activeSpace =
    state.spaces.find((s) => s.id === state.activeSpaceId) ?? state.spaces[0];

  const updateActiveSpace = (updater: (space: FocusSpace) => FocusSpace) => {
    setState((prev) => ({
      ...prev,
      spaces: prev.spaces.map((space) =>
        space.id === prev.activeSpaceId ? updater(space) : space
      ),
    }));
  };

  const handleSelectSpace = (spaceId: string) => {
    setState((prev) => ({
      ...prev,
      activeSpaceId: spaceId,
      view: 'workspace',
    }));
  };

  const handleCreateSpace = (name: string, archetypeId?: string) => {
    const newSpace = createFocusSpace(name, archetypeId);
    setState((prev) => ({
      ...prev,
      spaces: [newSpace, ...prev.spaces],
      activeSpaceId: newSpace.id,
      view: 'workspace',
      activeTab: 'tracker',
    }));
  };

  const handleTabChange = (tab: TabId) => {
    setState((prev) => ({ ...prev, activeTab: tab, view: 'workspace' }));
  };

  const handleGoToSpaces = () => {
    setState((prev) => ({ ...prev, view: 'spaces' }));
  };

  const handleCheckIn = (status: 'clean' | 'relapse', note?: string) => {
    updateActiveSpace((space) => logDailyCheckIn(space, status, note));
  };

  const handleUndoCheckIn = () => {
    updateActiveSpace((space) => undoTodayCheckIn(space));
  };

  const handleUpdateCalendarDay = (
    dateKey: string,
    status: 'clean' | 'relapse' | null,
    note?: string
  ) => {
    updateActiveSpace((space) => updateCalendarDayLog(space, dateKey, status, note));
  };

  const handleAutomateRecommendation = () => {
    updateActiveSpace((space) => applySmartRecommendation(space));
  };

  const handleToggleAnchor = (anchorId: string) => {
    updateActiveSpace((space) => ({
      ...space,
      anchors: toggleAnchor(space.anchors, anchorId),
    }));
  };

  const handleAddAnchor = (category: AnchorCategory, title: string, subtitle: string) => {
    updateActiveSpace((space) => ({
      ...space,
      anchors: addAnchor(space.anchors, category, title, subtitle),
    }));
  };

  const handleMoveAnchor = (anchorId: string, targetCategory: AnchorCategory) => {
    updateActiveSpace((space) => ({
      ...space,
      anchors: moveAnchor(space.anchors, anchorId, targetCategory),
    }));
  };

  const handleRemoveAnchor = (anchorId: string) => {
    updateActiveSpace((space) => ({
      ...space,
      anchors: removeAnchor(space.anchors, anchorId),
    }));
  };

  const handleRedeemReward = (rewardId: string) => {
    updateActiveSpace((space) => redeemReward(space, rewardId));
  };

  const handleAddReward = (input: AddRewardInput) => {
    updateActiveSpace((space) => addCustomReward(space, input));
  };

  const handleCycleQuote = () => {
    setState((prev) => ({
      ...prev,
      quoteIndex: (prev.quoteIndex + 1) % MINDFUL_QUOTES.length,
    }));
  };

  const handleToggleBookmark = (quoteId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedQuoteIds.includes(quoteId);
      return {
        ...prev,
        bookmarkedQuoteIds: exists
          ? prev.bookmarkedQuoteIds.filter((id) => id !== quoteId)
          : [...prev.bookmarkedQuoteIds, quoteId],
      };
    });
  };

  const handleSaveReflection = (quoteId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      reflectionsByQuoteId: {
        ...prev.reflectionsByQuoteId,
        [quoteId]: text,
      },
    }));
  };

  const handleUpdateDailyRate = (dailyCostUsd: number) => {
    updateActiveSpace((space) => ({
      ...space,
      dailyCostUsd,
    }));
  };

  const handleResetDemoData = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(createInitialAppState());
  };

  if (state.view === 'spaces') {
    return (
      <FocusSpacesScreen
        spaces={state.spaces}
        activeSpaceId={activeSpace.id}
        onSelectSpace={handleSelectSpace}
        onCreateSpace={handleCreateSpace}
      />
    );
  }

  return (
    <AppShell
      activeTab={state.activeTab}
      activeSpace={activeSpace}
      spaces={state.spaces}
      onTabChange={handleTabChange}
      onSelectSpace={handleSelectSpace}
      onGoToSpaces={handleGoToSpaces}
      onUpdateDailyRate={handleUpdateDailyRate}
      onResetDemoData={handleResetDemoData}
    >
      {state.activeTab === 'tracker' && (
        <TrackerScreen
          space={activeSpace}
          onCheckIn={handleCheckIn}
          onUndoCheckIn={handleUndoCheckIn}
          onAutomateRecommendation={handleAutomateRecommendation}
        />
      )}

      {state.activeTab === 'growth' && (
        <GrowthScreen
          space={activeSpace}
          onToggleAnchor={handleToggleAnchor}
          onAddAnchor={handleAddAnchor}
          onMoveAnchor={handleMoveAnchor}
          onRemoveAnchor={handleRemoveAnchor}
        />
      )}

      {state.activeTab === 'rewards' && (
        <RewardsScreen
          space={activeSpace}
          onRedeemReward={handleRedeemReward}
          onAddReward={handleAddReward}
        />
      )}

      {state.activeTab === 'insights' && (
        <InsightsScreen
          space={activeSpace}
          quoteIndex={state.quoteIndex}
          bookmarkedQuoteIds={state.bookmarkedQuoteIds}
          reflectionsByQuoteId={state.reflectionsByQuoteId}
          onCycleQuote={handleCycleQuote}
          onToggleBookmark={handleToggleBookmark}
          onSaveReflection={handleSaveReflection}
          onAddAnchorFromInsight={(title, subtitle) =>
            handleAddAnchor('non-negotiable', title, subtitle)
          }
          onUpdateCalendarDay={handleUpdateCalendarDay}
        />
      )}
    </AppShell>
  );
}

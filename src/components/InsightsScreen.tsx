import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  Bookmark,
  Brain,
  Check,
  Clock,
  ExternalLink,
  Loader2,
  Music,
  Play,
  Plus,
  Share2,
  Sparkles,
  TvMinimalPlay,
  X,
  Zap,
} from 'lucide-react';
import {
  COPILOT_QUICK_PROMPTS,
  MINDFUL_QUOTES,
  RECOVERY_CASE_STUDIES,
  VIDEO_GUIDANCE_LIST,
} from '../data/seedData';
import type {
  CaseStudy,
  CopilotMessage,
  FocusSpace,
  VideoGuidance,
} from '../types/recovery';
import { WarmImage } from './BrandMark';
import { MonthlyCalendarCard } from './MonthlyCalendarCard';

interface InsightsScreenProps {
  space: FocusSpace;
  quoteIndex: number;
  bookmarkedQuoteIds: string[];
  reflectionsByQuoteId: Record<string, string>;
  onCycleQuote: () => void;
  onToggleBookmark: (quoteId: string) => void;
  onSaveReflection: (quoteId: string, text: string) => void;
  onAddAnchorFromInsight: (title: string, subtitle: string) => void;
  onUpdateCalendarDay: (dateKey: string, status: 'clean' | 'relapse' | null, note?: string) => void;
}

export function InsightsScreen({
  space,
  quoteIndex,
  bookmarkedQuoteIds,
  reflectionsByQuoteId,
  onCycleQuote,
  onToggleBookmark,
  onSaveReflection,
  onAddAnchorFromInsight,
  onUpdateCalendarDay,
}: InsightsScreenProps) {
  const [showReflectDrawer, setShowReflectDrawer] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoGuidance | null>(null);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [addedAnchorToast, setAddedAnchorToast] = useState<string | null>(null);

  // Mindful AI Copilot state
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotError, setCopilotError] = useState<string | null>(null);

  const currentQuote = MINDFUL_QUOTES[quoteIndex % MINDFUL_QUOTES.length];
  const isBookmarked = bookmarkedQuoteIds.includes(currentQuote.id);
  const currentReflection = reflectionsByQuoteId[currentQuote.id] ?? '';
  const [draftReflection, setDraftReflection] = useState(currentReflection);

  const visibleStudies = showArchive
    ? RECOVERY_CASE_STUDIES
    : RECOVERY_CASE_STUDIES.filter((s) => !s.archived);

  const handleOpenReflect = () => {
    setDraftReflection(reflectionsByQuoteId[currentQuote.id] ?? '');
    setShowReflectDrawer((prev) => !prev);
  };

  const handleSaveReflectionSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSaveReflection(currentQuote.id, draftReflection.trim());
    setShowReflectDrawer(false);
  };

  const handleShareQuote = async () => {
    const formatted = `“${currentQuote.text}” — ${currentQuote.author}, ${currentQuote.source}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
    } catch {
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
    }
  };

  const handleAddInsightAnchor = (title: string, subtitle: string) => {
    onAddAnchorFromInsight(title, subtitle);
    setAddedAnchorToast(`Added "${title}" to your Growth Non-negotiables.`);
    setTimeout(() => setAddedAnchorToast(null), 3500);
  };

  const sendCopilotPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || copilotLoading) return;

    setCopilotError(null);
    setCopilotInput('');
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          habitName: space.name,
          streakDays: space.streakDays,
          recentPattern: space.patternInsight.detectedWindow,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setCopilotError(data?.error || 'Could not reach Mindful AI Copilot right now.');
        return;
      }

      const assistantMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCopilotMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setCopilotError('Unable to reach the Mindful AI Copilot server. Check your connection and try again.');
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleCopilotFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendCopilotPrompt(copilotInput);
  };

  return (
    <div className="space-y-7">
      {/* Top Feed Status Strip */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#f3ece1] border border-[#d8d0c8]/50 text-[10.5px] sm:text-[11px] font-semibold tracking-[0.1em] uppercase text-[#5c4f46] min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#c2652a] shrink-0" aria-hidden="true" />
          <span className="truncate">AI Recovery Feed · {space.name}</span>
        </div>

        <button
          type="button"
          onClick={onCycleQuote}
          className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 rounded-full hover:bg-[#f3ece1] text-xs font-medium text-[#6b5d53] hover:text-[#c2652a] whitespace-nowrap shrink-0 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c2652a] shrink-0" aria-hidden="true" />
          <span>Fresh Insights</span>
        </button>
      </div>

      {addedAnchorToast && (
        <div
          role="status"
          className="rounded-2xl bg-[#f8e7d8] border border-[#e3c2a6] px-4 py-3 text-xs font-medium text-[#5c361a] flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-[#c2652a]" aria-hidden="true" />
          <span>{addedAnchorToast}</span>
        </div>
      )}

      {/* Main Responsive Editorial Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column on Desktop (Daily Anchor + Mindful AI Copilot sticky sidebar) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Daily Mindful Anchor Quote Card */}
          <section
            aria-label="Daily Mindful Anchor"
            className="rounded-[28px] bg-[#f4ede3] border border-[#d8d0c8]/55 p-6 sm:p-7 shadow-sahara"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-[#c2652a]">
                <span className="font-serif text-base leading-none" aria-hidden="true">
                  &ldquo;
                </span>
                <span>Daily Mindful Anchor</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(currentQuote.id)}
                  aria-pressed={isBookmarked}
                  aria-label={isBookmarked ? 'Remove quote bookmark' : 'Bookmark daily anchor'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isBookmarked
                      ? 'bg-[#c2652a] text-[#fffdf9]'
                      : 'text-[#6b5d53] hover:bg-[#ebe1d4]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleShareQuote}
                  aria-label="Copy daily quote"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#6b5d53] hover:bg-[#ebe1d4] transition-colors"
                >
                  {copiedQuote ? (
                    <Check className="w-4 h-4 text-[#c2652a]" aria-hidden="true" />
                  ) : (
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <blockquote
              className="font-serif text-[1.6rem] sm:text-[1.75rem] leading-[1.34] text-[#2d241e] mb-5"
              data-testid="daily-anchor-quote"
            >
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-[#6b5d53]">
                — {currentQuote.author},{' '}
                <em className="italic">{currentQuote.source}</em>
              </p>

              <button
                type="button"
                onClick={handleOpenReflect}
                aria-expanded={showReflectDrawer}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#c2652a] hover:underline"
              >
                <span>{currentReflection ? 'Edit Reflection' : 'Reflect'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {currentReflection && !showReflectDrawer && (
              <div className="mt-4 pt-3.5 border-t border-[#e3d9cc] text-xs text-[#5c4f46] leading-relaxed">
                <span className="font-semibold text-[#2d241e] block mb-0.5">Your reflection:</span>
                {currentReflection}
              </div>
            )}

            {showReflectDrawer && (
              <form
                onSubmit={handleSaveReflectionSubmit}
                className="mt-4 pt-4 border-t border-[#e3d9cc] space-y-2.5"
              >
                <label
                  htmlFor="quote-reflection-input"
                  className="block text-xs font-medium text-[#5c4f46]"
                >
                  Private offline reflection
                </label>
                <textarea
                  id="quote-reflection-input"
                  rows={3}
                  value={draftReflection}
                  onChange={(e) => setDraftReflection(e.target.value)}
                  placeholder="What small system change makes today easier?"
                  className="w-full rounded-2xl bg-[#fffdf9] border border-[#d8d0c8] focus:border-[#c2652a] p-3 text-xs text-[#2d241e] placeholder:text-[#9c8e82] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReflectDrawer(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6b5d53] hover:bg-[#e9dfd2]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-xs font-semibold"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Mindful AI Copilot Card (shown here on Desktop; also rendered nicely at bottom on mobile via order) */}
          <section
            aria-label="Mindful AI Copilot"
            className="hidden lg:block rounded-[28px] bg-[#f3ece1] border border-[#d8d0c8]/55 p-6 shadow-sahara"
          >
            <CopilotCardBody
              copilotInput={copilotInput}
              setCopilotInput={setCopilotInput}
              copilotMessages={copilotMessages}
              copilotLoading={copilotLoading}
              copilotError={copilotError}
              onSubmit={handleCopilotFormSubmit}
              onQuickPrompt={(q) => void sendCopilotPrompt(q)}
              inputId="copilot-input-desktop"
            />
          </section>
        </div>

        {/* Right Column: Monthly Recovery Calendar + Curated Video Guidance + Recovery Case Studies */}
        <div className="lg:col-span-7 space-y-8">
          {/* Monthly Recovery Calendar */}
          <MonthlyCalendarCard space={space} onUpdateCalendarDay={onUpdateCalendarDay} />

          {/* Curated Video Guidance */}
          <section aria-label="Curated Video Guidance" className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-[1.6rem] sm:text-[1.75rem] leading-tight font-semibold text-[#2d241e]">
                  Curated Video Guidance
                </h2>
                <p className="text-[13px] text-[#6b5d53] mt-0.5">
                  Peer-reviewed neurological frameworks &amp; behavioral models
                </p>
              </div>
              <TvMinimalPlay className="w-5 h-5 text-[#c2652a] shrink-0 mt-1" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
              {VIDEO_GUIDANCE_LIST.map((video) => (
                <article
                  key={video.id}
                  className="overflow-hidden rounded-[26px] bg-[#fffdf9] border border-[#d8d0c8]/60 shadow-sahara flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2d241e]">
                    <WarmImage
                      src={video.imageUrl}
                      alt={video.imageAlt}
                      fallbackTitle={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2d241e]/80 backdrop-blur-xs text-[11px] font-medium text-[#faf5ee]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c2652a]" aria-hidden="true" />
                      <span>{video.badge}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      aria-label={`Open briefing for ${video.title}`}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#c2652a]/92 hover:bg-[#a85320] text-[#fffdf9] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
                    </button>

                    <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/75 text-[#fffdf9] text-[11px] font-semibold tabular-nums">
                      {video.duration}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11.5px] mb-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#c2652a]">
                          {video.category === 'Behavioral Science' ? (
                            <Brain className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                          <span>{video.category}</span>
                        </span>
                        <span className="text-[#87786c] tabular-nums">{video.stats}</span>
                      </div>

                      <h3 className="font-serif text-[1.35rem] leading-[1.22] font-bold text-[#2d241e] mb-2">
                        {video.title}
                      </h3>
                      <p className="text-[13px] leading-[1.55] text-[#6b5d53] line-clamp-3 mb-4">
                        {video.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#efe7dc]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-[#f4e6d8] text-[#9b4c1c] text-[11px] font-bold flex items-center justify-center shrink-0">
                          {video.creatorInitials}
                        </span>
                        <span className="text-xs font-medium text-[#5c4f46] truncate">
                          {video.creatorName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveVideo(video)}
                        className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-xs font-semibold shrink-0 transition-colors"
                      >
                        <span>Watch</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Recovery Case Studies */}
          <section aria-label="Recovery Case Studies" className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-[1.6rem] sm:text-[1.75rem] leading-tight font-semibold text-[#2d241e]">
                  Recovery Case Studies
                </h2>
                <p className="text-[13px] text-[#6b5d53] mt-0.5">
                  Empirical protocols tested by community members
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowArchive((prev) => !prev)}
                className="text-xs font-semibold text-[#c2652a] hover:underline whitespace-nowrap shrink-0 pb-1"
              >
                {showArchive ? 'Hide Archive' : 'View Archive'}
              </button>
            </div>

            <div className="space-y-4">
              {visibleStudies.map((study) => (
                <article
                  key={study.id}
                  className="rounded-[26px] bg-[#f4ede3] border border-[#d8d0c8]/55 p-5 sm:p-6 shadow-sahara-sm"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#fae6d6] text-[#b45a22] text-[10.5px] font-bold tracking-[0.08em] uppercase">
                        {study.categoryTag}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#6b5d53]">
                        <Award className="w-3.5 h-3.5 text-[#c2652a]" aria-hidden="true" />
                        <span>Verified Journey</span>
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#7c6d62] tabular-nums">
                      Day {study.dayCount}
                    </span>
                  </div>

                  <h3 className="font-serif text-[1.35rem] sm:text-[1.45rem] leading-[1.24] font-bold text-[#2d241e] mb-2">
                    {study.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.6] text-[#5c4f46] mb-4">
                    {study.summary}
                  </p>

                  {study.beforeValue && study.afterValue && (
                    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#efe7dc] px-4 py-3 mb-4">
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#87786c]">
                          {study.beforeLabel}
                        </div>
                        <div className="text-sm font-bold text-[#8c3c3c] mt-0.5 tabular-nums">
                          {study.beforeValue}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#87786c]">
                          {study.afterLabel}
                        </div>
                        <div className="text-sm font-bold text-[#c2652a] mt-0.5 tabular-nums">
                          {study.afterValue}
                        </div>
                      </div>
                    </div>
                  )}

                  {study.highlightNote && (
                    <div className="flex items-center gap-2 text-xs font-medium text-[#5c4f46] mb-4 px-1">
                      <Music className="w-3.5 h-3.5 text-[#c2652a] shrink-0" aria-hidden="true" />
                      <span>{study.highlightNote}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveStudy(study)}
                    className="w-full min-h-[44px] rounded-xl bg-[#ebe2d6] hover:bg-[#e3d7c8] text-[#2d241e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{study.ctaLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Mobile Placement: Mindful AI Copilot at Bottom matching reference */}
          <section
            aria-label="Mindful AI Copilot"
            className="lg:hidden rounded-[28px] bg-[#f3ece1] border border-[#d8d0c8]/55 p-5 sm:p-6 shadow-sahara"
          >
            <CopilotCardBody
              copilotInput={copilotInput}
              setCopilotInput={setCopilotInput}
              copilotMessages={copilotMessages}
              copilotLoading={copilotLoading}
              copilotError={copilotError}
              onSubmit={handleCopilotFormSubmit}
              onQuickPrompt={(q) => void sendCopilotPrompt(q)}
              inputId="copilot-input-mobile"
            />
          </section>
        </div>
      </div>

      {/* Video Briefing Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2d241e]/45 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <div className="w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] bg-[#faf5ee] border border-[#d8d0c8] overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
            <div className="relative h-48 w-full shrink-0">
              <WarmImage
                src={activeVideo.imageUrl}
                alt={activeVideo.imageAlt}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video briefing"
                className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-[#2d241e]/75 text-[#faf5ee] flex items-center justify-center hover:bg-[#2d241e]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              <span className="absolute bottom-3 left-4 px-2.5 py-1 rounded-full bg-[#2d241e]/80 text-[#faf5ee] text-[11px] font-medium">
                {activeVideo.creatorName} · {activeVideo.duration}
              </span>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c2652a]">
                  {activeVideo.category}
                </span>
                <h3
                  id="video-modal-title"
                  className="font-serif text-2xl font-bold text-[#2d241e] mt-0.5"
                >
                  {activeVideo.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-[#5c4f46]">{activeVideo.summary}</p>

              <div className="rounded-2xl bg-[#f3ece1] p-4 space-y-2.5">
                <div className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b5d53]">
                  Key Neurological Takeaways
                </div>
                <ul className="space-y-2 text-[13px] leading-relaxed text-[#2d241e] list-disc pl-4">
                  {activeVideo.keyTakeaways.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    handleAddInsightAnchor(
                      activeVideo.suggestedAnchorTitle,
                      activeVideo.suggestedAnchorSubtitle
                    );
                    setActiveVideo(null);
                  }}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Protocol Step to Growth</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#d8d0c8] text-xs font-semibold text-[#5c4f46] hover:bg-[#f3ece1]"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Study Protocol Modal */}
      {activeStudy && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2d241e]/45 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="study-modal-title"
        >
          <div className="w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] bg-[#faf5ee] border border-[#d8d0c8] p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c2652a]">
                  {activeStudy.categoryTag} · Day {activeStudy.dayCount}
                </span>
                <h3
                  id="study-modal-title"
                  className="font-serif text-2xl font-bold text-[#2d241e] mt-1"
                >
                  {activeStudy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveStudy(null)}
                aria-label="Close case study dialog"
                className="w-10 h-10 rounded-full hover:bg-[#efe7dc] flex items-center justify-center text-[#6b5d53] shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[#5c4f46]">{activeStudy.summary}</p>

            <div className="rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/60 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.1em] uppercase text-[#6b5d53]">
                <Clock className="w-3.5 h-3.5 text-[#c2652a]" aria-hidden="true" />
                <span>Daily Protocol Schedule</span>
              </div>
              <div className="space-y-2.5">
                {activeStudy.dailySchedule.map((row) => (
                  <div
                    key={row.time}
                    className="flex items-start gap-3 text-[13px] pb-2.5 border-b last:border-b-0 last:pb-0 border-[#f0e8de]"
                  >
                    <span className="font-mono text-xs font-semibold text-[#c2652a] w-20 shrink-0 pt-0.5 tabular-nums">
                      {row.time}
                    </span>
                    <span className="text-[#2d241e] leading-relaxed">{row.practice}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f3ece1] p-4">
              <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#7c6d62] mb-1">
                Core Takeaway
              </div>
              <p className="text-[13.5px] leading-relaxed text-[#4a3e36] italic">
                &ldquo;{activeStudy.keyLesson}&rdquo;
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setActiveStudy(null)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a85320] text-[#fffdf9] text-sm font-semibold"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CopilotCardBodyProps {
  copilotInput: string;
  setCopilotInput: (value: string) => void;
  copilotMessages: CopilotMessage[];
  copilotLoading: boolean;
  copilotError: string | null;
  onSubmit: (event: FormEvent) => void;
  onQuickPrompt: (prompt: string) => void;
  inputId: string;
}

function CopilotCardBody({
  copilotInput,
  setCopilotInput,
  copilotMessages,
  copilotLoading,
  copilotError,
  onSubmit,
  onQuickPrompt,
  inputId,
}: CopilotCardBodyProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="w-8 h-8 rounded-full bg-[#c2652a] text-[#fffdf9] flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4" aria-hidden="true" />
        </span>
        <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#2d241e]">
          Mindful AI Copilot
        </span>
      </div>

      <p className="text-[13.5px] leading-relaxed text-[#5c4f46] mb-4">
        Feeling a compulsive reflex right now? Get an immediate physiological reset technique.
      </p>

      {/* Conversation Thread */}
      {copilotMessages.length > 0 && (
        <div
          className="mb-4 max-h-64 overflow-y-auto space-y-2.5 pr-1"
          aria-live="polite"
        >
          {copilotMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#e9dfd2] text-[#2d241e] ml-6'
                  : 'bg-[#fffdf9] border border-[#d8d0c8]/60 text-[#2d241e] mr-3'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {copilotLoading && (
            <div className="rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/60 px-3.5 py-2.5 text-xs text-[#6b5d53] inline-flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c2652a]" aria-hidden="true" />
              <span>Preparing a calm reset…</span>
            </div>
          )}
        </div>
      )}

      {copilotError && (
        <div
          role="alert"
          className="mb-3 rounded-xl bg-[#f6e5e5] border border-[#e3c3c3] px-3.5 py-2.5 text-xs text-[#8c3c3c] leading-relaxed"
        >
          {copilotError}
        </div>
      )}

      <form onSubmit={onSubmit} className="mb-3">
        <label htmlFor={inputId} className="sr-only">
          Ask anything about managing withdrawal cravings
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-[#fffdf9] border border-[#d8d0c8]/80 focus-within:border-[#c2652a] p-1.5 transition-colors shadow-sahara-sm">
          <input
            id={inputId}
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            disabled={copilotLoading}
            placeholder="Ask anything about managing withdrawal cravings..."
            className="w-full min-w-0 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#2d241e] placeholder:text-[#9c8e82] focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={copilotLoading || !copilotInput.trim()}
            aria-label="Send to Mindful AI Copilot"
            className="w-10 h-10 rounded-xl bg-[#c2652a] hover:bg-[#a85320] disabled:opacity-50 text-[#fffdf9] flex items-center justify-center shrink-0 transition-colors"
          >
            {copilotLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 flex-wrap">
        {COPILOT_QUICK_PROMPTS.map((chip) => (
          <button
            key={chip}
            type="button"
            disabled={copilotLoading}
            onClick={() => onQuickPrompt(chip)}
            className="px-3 py-1.5 rounded-full bg-[#e9e0d5] hover:bg-[#dfd3c4] text-[11.5px] font-medium text-[#5c4f46] whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

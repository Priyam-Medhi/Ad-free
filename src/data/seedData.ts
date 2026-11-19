import type {
  AppState,
  ArchetypeDefinition,
  CaseStudy,
  FocusSpace,
  MindfulQuote,
  RewardItem,
  VideoGuidance,
} from '../types/recovery';
import { buildSeedCalendarLogs, getTodayDateKey } from '../utils/calendarUtils';

export const APP_IMAGES = {
  avatarUser: '/src/assets/images/avatar_user_1795072359980.jpg',
  mindfulAnchor: '/src/assets/images/tracker_mindful_anchor_1795072360311.jpg',
  calmHorizon: '/src/assets/images/tracker_calm_horizon_1795072360377.jpg',
  artisanDinner: '/src/assets/images/reward_artisan_dinner_1795072363811.jpg',
  mountainCabin: '/src/assets/images/reward_mountain_cabin_1795072359632.jpg',
  acousticGuitar: '/src/assets/images/reward_acoustic_guitar_1795072359767.jpg',
  videoDopamine: '/src/assets/images/video_dopamine_science_1795072411513.jpg',
  videoMinimalism: '/src/assets/images/video_digital_minimalism_1795072360344.jpg',
} as const;

export const REWARD_IMAGE_PRESETS = [
  {
    id: 'dinner',
    label: 'Artisan Dinner',
    url: APP_IMAGES.artisanDinner,
    alt: 'Candlelit artisan dinner on a warm oak wood table',
  },
  {
    id: 'cabin',
    label: 'Mountain Cabin',
    url: APP_IMAGES.mountainCabin,
    alt: 'Modern timber mountain cabin glowing at golden sunset',
  },
  {
    id: 'guitar',
    label: 'Acoustic Guitar',
    url: APP_IMAGES.acousticGuitar,
    alt: 'Handcrafted acoustic guitar leaning against a warm terracotta wall',
  },
  {
    id: 'reading',
    label: 'Reading Sanctuary',
    url: APP_IMAGES.mindfulAnchor,
    alt: 'Open hardcover book beneath a warm amber bedside lamp',
  },
  {
    id: 'morning',
    label: 'Morning Journal',
    url: APP_IMAGES.calmHorizon,
    alt: 'Sunlit oak desk with cream paper journal and stoneware coffee mug',
  },
] as const;

export const DEFAULT_REWARDS: RewardItem[] = [
  {
    id: 'reward-artisan-dinner',
    title: 'Specialty Artisan Dinner',
    subtitle: 'Milestone: 14 Days Clean • Earned fully from habit savings',
    targetDays: 14,
    budget: 60,
    imageUrl: APP_IMAGES.artisanDinner,
    imageAlt: 'Warm candlelit artisan bistro dinner on a wooden table',
    tierLabel: 'TARGET MET!',
    redeemed: false,
  },
  {
    id: 'reward-mountain-cabin',
    title: 'Weekend Mountain Cabin Getaway',
    subtitle: 'Milestone: 30 Days Clean • 16 days to freedom summit',
    targetDays: 30,
    budget: 220,
    imageUrl: APP_IMAGES.mountainCabin,
    imageAlt: 'Modern cedar mountain cabin nestled in golden autumn pines',
    tierLabel: 'IN PROGRESS',
    redeemed: false,
  },
  {
    id: 'reward-acoustic-guitar',
    title: 'Acoustic Guitar',
    subtitle: 'Milestone: 90 Days Clean • Replace digital noise with acoustic strings',
    targetDays: 90,
    budget: 350,
    imageUrl: APP_IMAGES.acousticGuitar,
    imageAlt: 'Spruce acoustic guitar leaning against a sun-baked plaster wall',
    tierLabel: 'LONG-TERM DREAM',
    redeemed: false,
  },
];

export const INITIAL_DOOMSCROLLING_SPACE: FocusSpace = {
  id: 'space-doomscrolling',
  name: 'Smartphone Doomscrolling',
  shortName: 'Doomscrolling',
  icon: 'smartphone',
  streakDays: 14,
  totalCleanDays: 14,
  dailyCostUsd: 10,
  dailyHoursSaved: 2.0357, // 14 * 2.0357 ≈ 28.5h
  savedUnitLabel: 'screen time',
  savedDisplayMode: 'hours',
  rewardPoolBonusUsd: 60,
  ritualHighlight: 'Evening digital sunset ritual maintained 4 nights running',
  resilienceSubtitle: 'Mindful calm restored • Top 8% resilience',
  checkedInToday: null,
  history: [
    { dayIndex: 1, dayLetter: 'M', label: 'D1', status: 'clean', freedomScore: 34, urgeBaseline: 15 },
    { dayIndex: 2, dayLetter: 'T', label: 'D2', status: 'clean', freedomScore: 42, urgeBaseline: 20 },
    { dayIndex: 3, dayLetter: 'W', label: 'D3', status: 'clean', freedomScore: 59, urgeBaseline: 30 },
    { dayIndex: 4, dayLetter: 'T', label: 'D4', status: 'clean', freedomScore: 71, urgeBaseline: 43 },
    { dayIndex: 5, dayLetter: 'F', label: 'D5', status: 'clean', freedomScore: 78, urgeBaseline: 56 },
    { dayIndex: 6, dayLetter: 'S', label: 'D6', status: 'clean', freedomScore: 81, urgeBaseline: 66 },
    { dayIndex: 7, dayLetter: 'S', label: 'D7', status: 'clean', freedomScore: 85, urgeBaseline: 74 },
    { dayIndex: 8, dayLetter: 'M', label: 'D8', status: 'clean', freedomScore: 89, urgeBaseline: 80 },
    { dayIndex: 9, dayLetter: 'T', label: 'D9', status: 'clean', freedomScore: 92, urgeBaseline: 85 },
    { dayIndex: 10, dayLetter: 'W', label: 'D10', status: 'clean', freedomScore: 94, urgeBaseline: 89 },
    { dayIndex: 11, dayLetter: 'T', label: 'D11', status: 'clean', freedomScore: 95, urgeBaseline: 92 },
    { dayIndex: 12, dayLetter: 'F', label: 'D12', status: 'clean', freedomScore: 97, urgeBaseline: 95 },
    { dayIndex: 13, dayLetter: 'S', label: 'D13', status: 'clean', freedomScore: 98, urgeBaseline: 97 },
    { dayIndex: 14, dayLetter: 'S', label: 'D14', status: 'clean', freedomScore: 99, urgeBaseline: 98 },
  ],
  calendarLogs: buildSeedCalendarLogs(getTodayDateKey()),
  anchors: [
    {
      id: 'anc-1',
      category: 'non-negotiable',
      title: 'Morning 15-min sunlight walk',
      subtitle: 'Circadian anchor',
      icon: 'sun',
      completed: true,
    },
    {
      id: 'anc-2',
      category: 'non-negotiable',
      title: 'No phone in bedroom after 9 PM',
      subtitle: 'Restoration boundary',
      icon: 'moon',
      completed: true,
    },
    {
      id: 'anc-3',
      category: 'todo',
      title: 'Read Chapter 4 of Atomic Habits',
      subtitle: 'Mindfulness reading',
      icon: 'book',
      completed: true,
    },
    {
      id: 'anc-4',
      category: 'todo',
      title: 'Drink 2.5L structured water',
      subtitle: 'Vitality & energy',
      icon: 'droplet',
      completed: false,
    },
    {
      id: 'anc-5',
      category: 'not-to-do',
      title: 'Do not open Instagram explore tab',
      subtitle: 'Zero algorithm feeding',
      icon: 'ban',
      completed: true,
    },
    {
      id: 'anc-6',
      category: 'not-to-do',
      title: 'No snacking past 8 PM',
      subtitle: 'Intermittent fast',
      icon: 'utensils',
      completed: false,
    },
  ],
  rewards: DEFAULT_REWARDS,
  patternInsight: {
    detectedWindow: '9:30 PM – 11:00 PM',
    detectedDescription:
      'Your highest urge moments occur between 9:30 PM – 11:00 PM on weeknights.',
    recommendation:
      'Enable wind-down grayscale mode at 9:00 PM and schedule a 10-minute non-negotiable bedtime reading session.',
    actionLabel: 'Automate 9:00 PM Grayscale',
    automated: false,
    automatedAnchorTitle: '9:00 PM Grayscale & 10-min bedside reading',
    automatedAnchorSubtitle: 'Automated wind-down anchor',
  },
  createdAt: '2026-11-04T09:00:00.000Z',
};

export const HABIT_ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: 'nicotine',
    name: 'Nicotine / Vaping',
    shortName: 'Nicotine',
    icon: 'wind',
    dailyCostUsd: 12,
    dailyHoursSaved: 0.75,
    savedUnitLabel: 'reclaimed',
    savedDisplayMode: 'currency',
    ritualHighlight: 'Fresh sanctuary ready for your first clean breath',
    patternInsight: {
      detectedWindow: '2:00 PM – 4:30 PM',
      detectedDescription:
        'Post-lunch oral fixation and afternoon focus dips are the most common nicotine cue windows.',
      recommendation:
        'Keep cold sparkling water or cinnamon toothpicks within reach and practice two slow physiological sighs when a craving peaks.',
      actionLabel: 'Add 2:30 PM Breath Reset',
      automated: false,
      automatedAnchorTitle: '2:30 PM Physiological Sigh Reset',
      automatedAnchorSubtitle: 'Autonomic craving breaker',
    },
    starterAnchors: [
      {
        category: 'non-negotiable',
        title: '5-minute morning outdoor breathing',
        subtitle: 'Lung clarity anchor',
        icon: 'wind',
        completed: false,
      },
      {
        category: 'non-negotiable',
        title: 'Drink a full glass of water at first urge',
        subtitle: 'Immediate cue interruption',
        icon: 'droplet',
        completed: false,
      },
      {
        category: 'todo',
        title: 'Clear pods and lighters from desk drawer',
        subtitle: 'Friction design',
        icon: 'sparkles',
        completed: false,
      },
      {
        category: 'not-to-do',
        title: 'No stepping outside with smokers on breaks',
        subtitle: 'Trigger boundary',
        icon: 'ban',
        completed: false,
      },
    ],
  },
  {
    id: 'sugar',
    name: 'Sugar & Junk Food',
    shortName: 'Sugar Reset',
    icon: 'croissant',
    dailyCostUsd: 9,
    dailyHoursSaved: 0.5,
    savedUnitLabel: 'nourishment',
    savedDisplayMode: 'currency',
    ritualHighlight: 'Fresh sanctuary ready for steady blood-sugar calm',
    patternInsight: {
      detectedWindow: '8:00 PM – 10:00 PM',
      detectedDescription:
        'Late-evening fatigue often mimics sweet cravings as the brain looks for quick glucose spikes.',
      recommendation:
        'Brew a warm spiced herbal tea after dinner and close the kitchen lights at 8:00 PM to signal rest.',
      actionLabel: 'Schedule 8:00 PM Tea Ritual',
      automated: false,
      automatedAnchorTitle: '8:00 PM Warm Herbal Tea Close-out',
      automatedAnchorSubtitle: 'Evening satiety ritual',
    },
    starterAnchors: [
      {
        category: 'non-negotiable',
        title: 'Protein-rich savory breakfast within 1 hour',
        subtitle: 'Glucose stability',
        icon: 'sun',
        completed: false,
      },
      {
        category: 'todo',
        title: 'Prep whole fruit & roasted nuts for afternoon',
        subtitle: 'Proactive nourishment',
        icon: 'heart',
        completed: false,
      },
      {
        category: 'not-to-do',
        title: 'No ultra-processed snacks past 8 PM',
        subtitle: 'Restorative fasting window',
        icon: 'utensils',
        completed: false,
      },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming / Late Night Screen',
    shortName: 'Late Gaming',
    icon: 'gamepad',
    dailyCostUsd: 8,
    dailyHoursSaved: 2.5,
    savedUnitLabel: 'evening rest',
    savedDisplayMode: 'hours',
    ritualHighlight: 'Fresh sanctuary ready for deep sleep restoration',
    patternInsight: {
      detectedWindow: '10:30 PM – 1:00 AM',
      detectedDescription:
        'One-more-match loops escalate sharply after 10:30 PM when prefrontal impulse control fatigues.',
      recommendation:
        'Set a hard router or console shutdown at 10:00 PM and keep an analog book beside your desk.',
      actionLabel: 'Automate 10:00 PM Hard Stop',
      automated: false,
      automatedAnchorTitle: '10:00 PM Console & Monitor Power-Down',
      automatedAnchorSubtitle: 'Circadian protection',
    },
    starterAnchors: [
      {
        category: 'non-negotiable',
        title: 'Shutdown PC/console by 10:00 PM sharp',
        subtitle: 'Sleep protection',
        icon: 'moon',
        completed: false,
      },
      {
        category: 'todo',
        title: 'Unplug controller and store in closet shelf',
        subtitle: '20-second friction rule',
        icon: 'sparkles',
        completed: false,
      },
      {
        category: 'not-to-do',
        title: 'No ranked queues after dinner',
        subtitle: 'Adrenaline boundary',
        icon: 'ban',
        completed: false,
      },
    ],
  },
  {
    id: 'spending',
    name: 'Compulsive Spending',
    shortName: 'Spending',
    icon: 'shopping',
    dailyCostUsd: 25,
    dailyHoursSaved: 1.0,
    savedUnitLabel: 'capital saved',
    savedDisplayMode: 'currency',
    ritualHighlight: 'Fresh sanctuary ready for intentional abundance',
    patternInsight: {
      detectedWindow: '7:30 PM – 9:30 PM',
      detectedDescription:
        'Boredom browsing on shopping apps spikes after work when seeking novelty and quick relief.',
      recommendation:
        'Enforce a 72-hour waiting list for every non-essential item and delete stored one-click cards.',
      actionLabel: 'Activate 72-Hour Cool-Off',
      automated: false,
      automatedAnchorTitle: '72-Hour Waiting List Before Any Purchase',
      automatedAnchorSubtitle: 'Impulse buffer',
    },
    starterAnchors: [
      {
        category: 'non-negotiable',
        title: 'Log every discretionary desire in 72h list',
        subtitle: 'Clarity pause',
        icon: 'book',
        completed: false,
      },
      {
        category: 'todo',
        title: 'Remove saved credit cards from browser',
        subtitle: 'Checkout friction',
        icon: 'clock',
        completed: false,
      },
      {
        category: 'not-to-do',
        title: 'No browsing flash-sale feeds when tired',
        subtitle: 'Emotional boundary',
        icon: 'ban',
        completed: false,
      },
    ],
  },
];

export const MINDFUL_QUOTES: MindfulQuote[] = [
  {
    id: 'quote-james-clear',
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
    source: 'Atomic Habits',
  },
  {
    id: 'quote-viktor-frankl',
    text: 'Between stimulus and response there is a space. In that space is our power to choose our response.',
    author: 'Viktor E. Frankl',
    source: "Man's Search for Meaning",
  },
  {
    id: 'quote-cal-newport',
    text: 'Clarity about what matters provides clarity about what does not.',
    author: 'Cal Newport',
    source: 'Digital Minimalism',
  },
  {
    id: 'quote-anna-lembke',
    text: 'The secret to finding balance is combining the science of desire with the wisdom of recovery.',
    author: 'Dr. Anna Lembke',
    source: 'Dopamine Nation',
  },
];

export const VIDEO_GUIDANCE_LIST: VideoGuidance[] = [
  {
    id: 'vid-dopamine-fasting',
    title: 'How Dopamine Fasting Rewires Your Brain',
    badge: 'YouTube Rec',
    category: 'Behavioral Science',
    stats: '1.4M views • 98% resonance',
    duration: '18:24',
    creatorInitials: 'AH',
    creatorName: 'Dr. A. Huberman Style',
    summary:
      'Deconstruct the synaptic baseline shift triggered by continuous short-form scrolling and learn actionable protocols to restore tonic dopamine sensitivity.',
    imageUrl: APP_IMAGES.videoDopamine,
    imageAlt: 'Neuroscience educator speaking calmly in a warm wood-paneled library',
    keyTakeaways: [
      'Supernormal digital spikes pull your tonic dopamine baseline below resting level, creating restlessness right after closing an app.',
      'Fourteen consecutive days of low-friction abstinence restores receptor sensitivity so ordinary analog joys feel vivid again.',
      'Pair morning sunlight with delayed phone exposure (45 minutes) to anchor cortisol and baseline motivation.',
    ],
    suggestedAnchorTitle: 'Delay first phone check 45 min after waking',
    suggestedAnchorSubtitle: 'Tonic dopamine baseline protection',
  },
  {
    id: 'vid-infinite-scroll',
    title: 'Breaking the Endless Infinite Scroll Addiction',
    badge: 'Deep Work Guild',
    category: 'Digital Minimalism',
    stats: '890K views • High impact',
    duration: '12:10',
    creatorInitials: 'CN',
    creatorName: 'Cal Newport Cadence',
    summary:
      'Cal Newport style breakdown: how algorithmic feeds engineer compulsion loops, and practical architectural shifts that return agency to your evenings.',
    imageUrl: APP_IMAGES.videoMinimalism,
    imageAlt: 'Warm sunlit wooden study desk with open leather notebook and phone face-down',
    keyTakeaways: [
      'Willpower fails against variable-ratio feeds; architectural boundaries (charging outside the bedroom) win effortlessly.',
      'High-quality leisure requires active craft—reading, walking, or instrument practice—before passive rest.',
      'Batch intentional digital communication into two fixed 15-minute windows instead of ambient checking.',
    ],
    suggestedAnchorTitle: 'Keep phone charging in hallway after 9 PM',
    suggestedAnchorSubtitle: 'Architectural evening boundary',
  },
];

export const RECOVERY_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'study-marcus',
    categoryTag: 'DOPAMINE RESET',
    dayCount: 60,
    title: "From 7 Hours Screen Time to 45 Minutes: Marcus's 60-Day Protocol",
    summary:
      'Marcus eliminated midnight phone check-ins by relocating his device to a physical foyer lockbox and substituting a bedside Kindle.',
    beforeLabel: 'BEFORE PROTOCOL',
    beforeValue: '7h 14m / day avg',
    afterLabel: 'CURRENT BASELINE',
    afterValue: '42m / day avg',
    ctaLabel: 'Read Full Study & Daily Schedule',
    dailySchedule: [
      { time: '07:00 AM', practice: 'Wake to analog alarm clock; 15-minute daylight walk before touching any screen.' },
      { time: '12:30 PM', practice: 'Single 15-minute message batch on desktop; social apps removed from home screen.' },
      { time: '08:45 PM', practice: 'Phone placed in foyer wooden lockbox; grayscale filter turns on automatically.' },
      { time: '09:15 PM', practice: '30 minutes of fiction reading under warm amber bedside lamp.' },
    ],
    keyLesson:
      'Physical distance beats app timers. Moving the phone 14 steps away ended 90% of late-night automatic pickups within week one.',
  },
  {
    id: 'study-elena',
    categoryTag: 'HABIT SUBSTITUTION',
    dayCount: 42,
    title: "Elena's Replacement Rituals: Evening Piano vs. Blue Light",
    summary:
      'Tackling post-dinner craving surges with tactile acoustic engagement. Hands engaged on physical keys made touchscreens completely friction-heavy.',
    highlightNote: '30 min nocturne practice replaced 2.5h TikTok loops',
    ctaLabel: "Read Elena's Step-by-Step Transition",
    dailySchedule: [
      { time: '06:45 PM', practice: 'Phone docked on kitchen counter immediately after dinner cleanup.' },
      { time: '07:15 PM', practice: 'Open sheet music already resting on the piano stand—zero setup friction.' },
      { time: '07:45 PM', practice: 'Chamomile tea and 5-line paper reflection logging urge intensity (1–10).' },
    ],
    keyLesson:
      'Never leave a craving vacuum. Replace passive scrolling with an activity that occupies both hands and rewards subtle mastery.',
  },
  {
    id: 'study-tariq',
    categoryTag: 'CIRCADIAN RESTORATION',
    dayCount: 90,
    title: "Tariq's Analog Mornings: Reclaiming Two Deep-Work Hours Daily",
    summary:
      'By delaying smartphone unlock until 9:00 AM for 90 consecutive days, Tariq ended morning anxiety spikes and finished his architectural thesis.',
    beforeLabel: 'MORNING SCROLL',
    beforeValue: '1h 50m / morning',
    afterLabel: 'DEEP WORK GAINED',
    afterValue: '2h 10m / morning',
    ctaLabel: "Read Tariq's 90-Day Blueprint",
    archived: true,
    dailySchedule: [
      { time: '06:30 AM', practice: 'Pour-over coffee and 10 minutes of unfiltered paper journaling.' },
      { time: '07:00 AM', practice: '90-minute offline writing sprint with Wi-Fi paused.' },
      { time: '09:00 AM', practice: 'First intentional phone check standing up near the kitchen window.' },
    ],
    keyLesson:
      'The first 30 minutes of attention set the neurochemical tone for the entire day. Guard your morning before checking other people’s priorities.',
  },
];

export const COPILOT_QUICK_PROMPTS = [
  'Auto-swiping loop',
  '2-min urge reset',
  'Bedtime impulse',
];

export function createInitialAppState(): AppState {
  return {
    view: 'spaces',
    activeTab: 'tracker',
    activeSpaceId: INITIAL_DOOMSCROLLING_SPACE.id,
    spaces: [INITIAL_DOOMSCROLLING_SPACE],
    quoteIndex: 0,
    bookmarkedQuoteIds: [],
    reflectionsByQuoteId: {},
  };
}

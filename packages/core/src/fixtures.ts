/**
 * Demo fixtures.
 *
 * These types mirror the shapes the .NET gateway will return, so that swapping
 * `mocks/` for generated OpenAPI types is a mechanical change rather than a
 * rewrite. Every monetary field is an integer in minor units and is named
 * `*Minor` to make that impossible to miss (CLAUDE.md #1).
 *
 * Feed clips: `posterUrl` / `videoUrl` stay empty until the client delivers the
 * ~30 example clips (week 1). The gradient placeholder keeps the layout honest
 * in the meantime — same geometry, no external dependency.
 */

export interface Creator {
  handle: string;
  displayName: string;
  followerCount: number;
  avatarUrl?: string;
  verified: boolean;
}

/**
 * A campaign as it appears in the discovery feed — one per screen, scrolled
 * like TikTok. There is no video here: the creator is browsing briefs, not
 * watching content, so the card leads with the offer.
 */
export interface FeedCampaign {
  id: string;
  brandName: string;
  brandInitials: string;
  /** The campaign's hook, quoted — what the brand wants said. */
  hook: string;
  hookSubtitle: string;
  description: string;
  ratePerMilleMinor: number;
  estimatedMinMinor: number;
  estimatedMaxMinor: number;
  budgetRemainingMinor: number;
  slotsLeft: number;
  /** 0–100. */
  matchPercent: number;
  accent: string;
  /** Two stops. Web composes a CSS gradient; RN feeds them to expo-linear-gradient. */
  gradientStops: [string, string];
}

export type MatchStrength = "strong" | "worth-trying";

export interface MatchReason {
  text: string;
}

export interface CampaignAccessRule {
  minFollowerThreshold: number;
  productPlacement: boolean;
}

export interface Campaign {
  id: string;
  brandName: string;
  title: string;
  /** Structured brief; the demo shows the requirement chips. */
  requirements: string[];
  ratePerMilleMinor: number;
  estimatedEarningsMinMinor: number;
  estimatedEarningsMaxMinor: number;
  deadline: string;
  slotsLeft: number;
  match: MatchStrength;
  matchReasons: MatchReason[];
  accessRule: CampaignAccessRule;
  /** Set when the signed-in creator does not meet `accessRule`. */
  locked: boolean;
  accent: string;
}

export interface StyleDimension {
  key: string;
  label: string;
  /** 0–100. */
  value: number;
}

/** No claim without evidence — CLAUDE.md #7. `evidence` is required, not optional. */
export interface PortraitClaim {
  id: string;
  statement: string;
  evidence: {
    clipTitle: string;
    clipDate: string;
    timestamp: string;
  };
}

export interface Portrait {
  archetype: string;
  tagline: string;
  /** preliminary → observed → confirmed. The demo is honest about being early. */
  confidence: "preliminary" | "observed" | "confirmed";
  dimensions: StyleDimension[];
  claims: PortraitClaim[];
  growthTip: string;
}

export type PayoutStatus =
  | "paid"
  | "scheduledDay7"
  | "scheduledDay14"
  | "reserved"
  | "underReview";

export interface PayoutRow {
  id: string;
  campaignName: string;
  brandName: string;
  validatedViews: number;
  amountMinor: number;
  status: PayoutStatus;
}

export interface EarningsSummary {
  thisMonthMinor: number;
  pendingValidationMinor: number;
  reserveMinor: number;
  reserveReleaseDate: string;
  availableMinor: number;
  trendPercent: number;
  /** 30 daily cumulative points, minor units. */
  timeline: number[];
  rows: PayoutRow[];
}

export interface BrandCampaignRow {
  id: string;
  name: string;
  startDate: string;
  status: "active" | "draft" | "closed";
  budgetMinor: number;
  spentMinor: number;
  views: number;
}

export interface LeaderboardRow {
  handle: string;
  displayName: string;
  validatedViews: number;
  earnedMinor: number;
  underReview: boolean;
}

// ---------------------------------------------------------------------------

export const currentCreator: Creator = {
  handle: "@alex_dumitrescu",
  displayName: "Alex Dumitrescu",
  followerCount: 34_500,
  verified: true,
};

/**
 * Deliberately local and small: a kebab place, a barber, a neighbourhood gym.
 * These are the businesses that have never run a campaign — the ones the whole
 * product exists for — so the budgets and payouts here stay honest about that
 * scale rather than borrowing the numbers of a national brand.
 */
export const feedCampaigns: FeedCampaign[] = [
  {
    id: "cmp-shaorma",
    brandName: "Shaorma la Vlad",
    brandInitials: "SV",
    hook: "Zi-le de ce te întorci",
    hookSubtitle: "fără scenariu, doar ce mănânci tu",
    description: "Local de cartier. Prima noastră campanie, vreodată.",
    ratePerMilleMinor: 250,
    estimatedMinMinor: 3_000,
    estimatedMaxMinor: 8_500,
    budgetRemainingMinor: 24_000,
    slotsLeft: 9,
    matchPercent: 88,
    accent: "#FFCC7C",
    gradientStops: ["#3b2a17", "#221407"],
  },
  {
    id: "cmp-fit",
    brandName: "FitZone Studio",
    brandInitials: "FZ",
    hook: "Prima lună gratis",
    hookSubtitle: "cum arată un antrenament la noi",
    description: "Sală de cartier. Demonstrație reală, fără promisiuni false.",
    ratePerMilleMinor: 300,
    estimatedMinMinor: 4_000,
    estimatedMaxMinor: 11_000,
    budgetRemainingMinor: 38_000,
    slotsLeft: 8,
    matchPercent: 87,
    accent: "#7CFFB2",
    gradientStops: ["#123a2c", "#0d1f1a"],
  },
  {
    id: "cmp-frizerie",
    brandName: "Frizeria Nord",
    brandInitials: "FN",
    hook: "Tunsoarea care mi-a schimbat săptămâna",
    hookSubtitle: "înainte și după, atât",
    description: "Doi frizeri, un scaun liber. Vrem să ne știe cartierul.",
    ratePerMilleMinor: 220,
    estimatedMinMinor: 2_500,
    estimatedMaxMinor: 6_000,
    budgetRemainingMinor: 18_000,
    slotsLeft: 6,
    matchPercent: 81,
    accent: "#cabeff",
    gradientStops: ["#2a1f3b", "#1a1030"],
  },
  {
    id: "cmp-cofetarie",
    brandName: "Cofetăria Miere",
    brandInitials: "CM",
    hook: "Prăjitura pe care o cerea bunica",
    hookSubtitle: "spune-ne ce-ți amintește",
    description: "Rețete de familie, făcute dimineața. Fără conservanți, fără agenție.",
    ratePerMilleMinor: 260,
    estimatedMinMinor: 3_500,
    estimatedMaxMinor: 9_000,
    budgetRemainingMinor: 31_000,
    slotsLeft: 11,
    matchPercent: 84,
    accent: "#FFCC7C",
    gradientStops: ["#3b2a1f", "#1d1408"],
  },
  {
    id: "cmp-verde",
    brandName: "Verde Market",
    brandInitials: "VM",
    hook: "Cina în 15 minute",
    hookSubtitle: "doar din coșul de sezon",
    description: "Aprozar de cartier. Gătit real, în bucătăria ta.",
    ratePerMilleMinor: 200,
    estimatedMinMinor: 2_000,
    estimatedMaxMinor: 5_500,
    budgetRemainingMinor: 16_000,
    slotsLeft: 20,
    matchPercent: 72,
    accent: "#7CFFB2",
    gradientStops: ["#1f3b28", "#0f2416"],
  },
];

export const campaigns: Campaign[] = [
  {
    id: "cmp-2",
    brandName: "Lumina Tech",
    title: "Summer Essentials",
    requirements: ["#LuminaTech", "@luminatech", "15–60 sec"],
    ratePerMilleMinor: 200,
    estimatedEarningsMinMinor: 80_000,
    estimatedEarningsMaxMinor: 150_000,
    deadline: "30 oct. 2026",
    slotsLeft: 12,
    match: "strong",
    matchReasons: [
      { text: "Ai deja 4 clipuri organice pe rutina de dimineață" },
      { text: "Publicul tău se suprapune cu nișa Tech & Gadgets" },
    ],
    accessRule: { minFollowerThreshold: 0, productPlacement: false },
    locked: false,
    accent: "#947dff",
  },
  {
    id: "cmp-3",
    brandName: "Aura Home",
    title: "Tech Review Series",
    requirements: ["#AuraHome", "produsul vizibil", "30–90 sec"],
    ratePerMilleMinor: 350,
    estimatedEarningsMinMinor: 120_000,
    estimatedEarningsMaxMinor: 280_000,
    deadline: "12 nov. 2026",
    slotsLeft: 5,
    match: "strong",
    matchReasons: [{ text: "Engagement ridicat pe clipurile de tip review" }],
    accessRule: { minFollowerThreshold: 0, productPlacement: false },
    locked: false,
    accent: "#7CFFB2",
  },
  {
    id: "cmp-6",
    brandName: "Elite Fragrance",
    title: "Private Collection",
    requirements: ["produsul vizibil", "#EliteFragrance", "60 sec+"],
    ratePerMilleMinor: 1_200,
    estimatedEarningsMinMinor: 300_000,
    estimatedEarningsMaxMinor: 750_000,
    deadline: "05 dec. 2026",
    slotsLeft: 3,
    match: "worth-trying",
    matchReasons: [{ text: "Stilul tău vizual se apropie de brief" }],
    accessRule: { minFollowerThreshold: 35_000, productPlacement: true },
    locked: true,
    accent: "#FFCC7C",
  },
  {
    id: "cmp-4",
    brandName: "Verde Market",
    title: "Coș de sezon",
    requirements: ["#VerdeMarket", "@verdemarket", "20–60 sec"],
    ratePerMilleMinor: 200,
    estimatedEarningsMinMinor: 45_000,
    estimatedEarningsMaxMinor: 110_000,
    deadline: "18 nov. 2026",
    slotsLeft: 20,
    match: "worth-trying",
    matchReasons: [{ text: "Format scurt, apropiat de ce postezi deja" }],
    accessRule: { minFollowerThreshold: 0, productPlacement: false },
    locked: false,
    accent: "#7CFFB2",
  },
];

export const portrait: Portrait = {
  archetype: "Povestitorul Cald",
  tagline:
    "Transformi momente obișnuite în povești care rezonează — fără să pară vreodată reclamă.",
  confidence: "preliminary",
  dimensions: [
    { key: "warmth", label: "Căldură", value: 82 },
    { key: "energy", label: "Energie", value: 61 },
    { key: "authority", label: "Autoritate", value: 44 },
    { key: "refinement", label: "Rafinament", value: 70 },
    { key: "convention", label: "Convenție", value: 38 },
    { key: "humor", label: "Umor", value: 56 },
    { key: "demonstration", label: "Demonstrație", value: 49 },
    { key: "intimacy", label: "Intimitate", value: 88 },
  ],
  claims: [
    {
      id: "claim-1",
      statement:
        "Cele mai bune clipuri ale tale încep cu o obiecție, nu cu un salut.",
      evidence: { clipTitle: "Rutina de dimineață", clipDate: "3 mai", timestamp: "0:02" },
    },
    {
      id: "claim-2",
      statement:
        "Ești în primii 5% pe intimitate în nișa ta — vorbești cu camera, nu spre ea.",
      evidence: { clipTitle: "Ce gătesc într-o seară grea", clipDate: "22 iunie", timestamp: "0:11" },
    },
    {
      id: "claim-3",
      statement:
        "Clipurile filmate lângă fereastră au retenție cu 40% peste media ta.",
      evidence: { clipTitle: "Cafeaua de sâmbătă", clipDate: "9 iulie", timestamp: "0:00" },
    },
  ],
  growthTip:
    "Punctul slab e lumina: filmezi seara, sub plafonieră. Mută-te lângă fereastră și retenția crește.",
};

export const earnings: EarningsSummary = {
  thisMonthMinor: 428_050,
  pendingValidationMinor: 84_020,
  reserveMinor: 53_500,
  reserveReleaseDate: "12 sept.",
  availableMinor: 289_130,
  trendPercent: 12.4,
  timeline: [
    12_000, 24_500, 31_200, 44_800, 52_000, 61_300, 78_900, 92_400, 101_000, 118_600,
    131_200, 142_800, 158_400, 171_000, 186_700, 199_300, 214_800, 228_400, 241_000,
    258_600, 271_200, 288_800, 301_400, 318_000, 332_600, 349_200, 366_800, 388_400,
    408_000, 428_050,
  ],
  rows: [
    {
      id: "p-1",
      campaignName: "Morning Coffee Kit",
      brandName: "Kaffa Roasters",
      validatedViews: 173_400,
      amountMinor: 34_700,
      status: "paid",
    },
    {
      id: "p-2",
      campaignName: "Summer Essentials",
      brandName: "Lumina Tech",
      validatedViews: 256_000,
      amountMinor: 51_200,
      status: "scheduledDay7",
    },
    {
      id: "p-3",
      campaignName: "Tech Review Series",
      brandName: "Aura Home",
      validatedViews: 256_000,
      amountMinor: 89_600,
      status: "scheduledDay14",
    },
    {
      id: "p-4",
      campaignName: "Coș de sezon",
      brandName: "Verde Market",
      validatedViews: 112_000,
      amountMinor: 22_400,
      status: "reserved",
    },
    {
      id: "p-5",
      campaignName: "Rutina de 20 min",
      brandName: "Nord Fitness",
      validatedViews: 139_500,
      amountMinor: 41_850,
      status: "underReview",
    },
  ],
};

export const brandSummary = {
  managerName: "Alex Ionescu",
  brandName: "Kaffa Roasters",
  activeCampaigns: 12,
  activeCampaignsDelta: 2,
  totalReach: 2_400_000,
  reachGrowthPercent: 18,
  totalSpentMinor: 4_285_000,
  budgetMinor: 6_000_000,
  totalViews: 8_120_000,
  activeCreators: 84,
  effectiveCpmMinor: 178,
  /** Live counter for the demo — the one real number on this screen. */
  liveTestClipViews: 4_128,
};

export const brandCampaigns: BrandCampaignRow[] = [
  {
    id: "cmp-1",
    name: "Premium Coffee Kit Launch",
    startDate: "01 oct. 2026",
    status: "active",
    budgetMinor: 1_500_000,
    spentMinor: 942_000,
    views: 3_140_000,
  },
  {
    id: "cmp-2",
    name: "Summer Essentials",
    startDate: "12 sept. 2026",
    status: "active",
    budgetMinor: 800_000,
    spentMinor: 618_000,
    views: 2_060_000,
  },
  {
    id: "cmp-7",
    name: "Ediție limitată — toamnă",
    startDate: "28 oct. 2026",
    status: "draft",
    budgetMinor: 400_000,
    spentMinor: 0,
    views: 0,
  },
  {
    id: "cmp-8",
    name: "Kit de cadou",
    startDate: "02 aug. 2026",
    status: "closed",
    budgetMinor: 1_200_000,
    spentMinor: 1_180_000,
    views: 2_920_000,
  },
];

export const leaderboard: LeaderboardRow[] = [
  {
    handle: "@mihai_reviews",
    displayName: "Mihai Popescu",
    validatedViews: 512_000,
    earnedMinor: 179_200,
    underReview: false,
  },
  {
    handle: "@ioana.face",
    displayName: "Ioana Constantin",
    validatedViews: 384_000,
    earnedMinor: 76_800,
    underReview: false,
  },
  {
    handle: "@alex_dumitrescu",
    displayName: "Alex Dumitrescu",
    validatedViews: 173_400,
    earnedMinor: 34_700,
    underReview: false,
  },
  {
    handle: "@raluca.move",
    displayName: "Raluca Ene",
    validatedViews: 139_500,
    earnedMinor: 41_850,
    underReview: true,
  },
];

export const assistantThread = [
  {
    role: "user" as const,
    text: "Cum aș face un clip pentru campania Morning Coffee Kit?",
  },
  {
    role: "assistant" as const,
    text: "Clipurile tale de dimineață bat media ta cu 40%. Începe în bucătăria ta, cu ce te enervează la cafeaua proastă — arată kitul abia după ce ai livrat poanta.",
    evidence: "3 mai",
  },
];

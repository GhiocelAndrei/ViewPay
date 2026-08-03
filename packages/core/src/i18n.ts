/**
 * UI copy lives here, never inline in components (BUILD_PLAN D14).
 * Romanian is the only locale for the demo; the shape is deliberately
 * compatible with react-i18next so swapping it in later is mechanical.
 */

export const ro = {
  nav: {
    feed: "Feed",
    campaigns: "Campanii",
    profile: "Profilul meu",
    earnings: "Câștiguri",
    assistant: "Asistent",
    settings: "Setări",
    support: "Suport",
    analytics: "Analize",
    creators: "Creatori",
    helpCenter: "Centru de ajutor",
    logout: "Ieșire",
  },
  roles: {
    creator: "Creator",
    brandManager: "Manager de brand",
  },
  landing: {
    navCreator: "Sunt creator",
    navBrand: "Am o afacere",
    signIn: "Intră în cont",
    heroBadge: "Pentru afaceri mici și creatori mici",
    heroTitle: "Reclama pe TikTok nu mai e doar pentru cei mari",
    heroSubtitle:
      "Shaormeria din colț își face prima campanie cu 300 €. Creatorul cu 2.000 de urmăritori e plătit pentru fiecare vizualizare. Vira îi pune la aceeași masă — și plătește doar rezultatul măsurat.",
    heroCtaCreator: "Sunt creator",
    heroCtaBrand: "Am o afacere",
    heroNote: "Fără abonament, fără contract anual, fără agenție la mijloc.",
    proof: {
      minBudget: "buget minim de campanie",
      minFollowers: "urmăritori — atât îți trebuie",
      creatorFee: "cost pentru creatori, oricând",
    },
    forWhoTitle: "Pentru cine am construit Vira",
    forWhoSubtitle:
      "Nu pentru brandurile care au deja agenție și nici pentru influencerii care au deja contracte. Pentru ceilalți.",
    audiences: [
      {
        icon: "storefront",
        eyebrow: "Ai o afacere mică",
        title: "Nu-ți trebuie agenție și nici buget de corporație",
        points: [
          "Pornești de la 300 € — cât costă o zi de fluturași",
          "Nu scrii brief-uri. Răspunzi la o întrebare: ce vrei să se întâmple?",
          "Filmează oameni reali din orașul tău, nu un actor dintr-un studio",
          "Plătești doar vizualizările verificate. Restul se întoarce.",
        ],
      },
      {
        icon: "person",
        eyebrow: "Ai câteva mii de urmăritori",
        title: "Nu trebuie să fii influencer ca să fii plătit",
        points: [
          "De la 1.000 de urmăritori. Contează cât de mult te urmăresc, nu câți sunt.",
          "Aceeași rată pe mia de vizualizări ca oricine altcineva de pe platformă",
          "Fără negocieri pe DM și fără „îți dăm produsul gratis”",
          "Vezi din start cât ai câștiga la audiența ta",
        ],
      },
    ],
    howTitle: "Cum funcționează, pentru creatori",
    howSubtitle: "Trei pași. Fără negocieri pe Discord și fără plăți pe încredere.",
    steps: [
      {
        icon: "link",
        title: "Îți conectezi contul de TikTok",
        text: "O autorizare standard. Vira citește doar clipurile și cifrele tale publice — nimic altceva.",
      },
      {
        icon: "campaign",
        title: "Alegi o campanie",
        text: "Vezi ce vrea afacerea, rata pe mia de vizualizări și cât ai câștiga la audiența ta. Aplici doar unde vrei.",
      },
      {
        icon: "payments",
        title: "Postezi și încasezi",
        text: "Postezi normal, de pe contul tău. Vira măsoară vizualizările validate și plătește în tranșe.",
      },
    ],
    brandsTitle: "Prima ta reclamă, chiar dacă n-ai mai făcut niciodată una",
    brandsText:
      "Nu-ți trebuie fotograf, agenție sau buget de mii de euro. Spui ce vrei să se întâmple, pui un buget, iar oameni reali din orașul tău filmează. Plătești doar vizualizările verificate prin API-ul oficial TikTok.",
    brandsPoints: [
      "Buget de la 300 € — și îl oprești când vrei",
      "Vizualizări citite din API-ul oficial, nu din capturi de ecran",
      "Bugetul neconsumat se întoarce automat în cont",
    ],
    brandsCardLabel: "Exemplu: campanie de cartier",
    campaignsTitle: "Cine își face reclamă acum pe Vira",
    campaignsSubtitle:
      "O sală de cartier, o shaormerie, o frizerie. Exact genul de afaceri care până acum n-aveau unde.",
    seeAll: "Vezi toate campaniile",
    footerNote: "Vira — reclamă pe TikTok pentru afaceri mici.",
  },
  signIn: {
    title: "Intră în Vira",
    subtitle: "Alege cum vrei să continui.",
    creatorTitle: "Continuă cu TikTok",
    creatorText: "Pentru creatori. Îți conectezi contul și vezi campaniile potrivite.",
    brandTitle: "Cont de business",
    brandText: "Pentru branduri. Creezi campanii și urmărești rezultatele.",
    paidOut: "plătiți către creatori",
    legal: "Prin continuare accepți Termenii și Politica de confidențialitate.",
    backToSite: "Înapoi la site",
  },
  feed: {
    earned: "generați",
    verifiedViews: "vizualizări verificate",
    viewCampaign: "Vezi campania",
    madeWithVira: "Creat cu Vira",
    nextVideo: "Următorul video",
    yourEarnings: "Câștigurile tale",
    firstCampaignCta: "Aplică la prima campanie",
  },
  campaigns: {
    title: "Marketplace de campanii",
    subtitle:
      "Descoperă campanii potrivite pentru stilul tău și pentru publicul pe care îl ai deja.",
    filters: { niche: "Nișă", payout: "Plată", deadline: "Termen" },
    payoutRate: "Rată de plată",
    estimatedEarnings: "Câștig estimat",
    whyItMatches: "De ce ți se potrivește",
    deadline: "Termen limită",
    availability: "Locuri rămase",
    slotsLeft: (n: number) => `${n} locuri rămase`,
    apply: "Aplică acum",
    strongMatch: "Se potrivește bine",
    worthTrying: "Merită încercat",
    lockedFollowers: (n: string) => `Necesită minimum ${n} urmăritori`,
    policyTitle: "Politica campaniei",
    productPlacementNote:
      "Această campanie cere ca produsul să apară în clip, iar creatorul îl achiziționează singur.",
  },
  portrait: {
    tabPortrait: "Amprentă",
    tabVideos: "Videoclipuri",
    archetype: "Arhetip de creator",
    evidence: "Dovezi",
    evidenceNote: "Fiecare afirmație e susținută de un clip din contul tău.",
    growthTip: "Ce te-ar crește",
    styleDimensions: "Dimensiuni de stil",
    followers: "urmăritori",
    preliminary: "Preliminar",
    preliminaryNote:
      "Portret construit pe clipurile analizate până acum. Se îmbogățește după fiecare campanie.",
    seeClip: "Vezi clipul",
  },
  earnings: {
    title: "Câștiguri",
    thisMonth: "Luna aceasta",
    pendingValidation: "În validare",
    pendingNote: "Vizualizările mai noi de 72 de ore nu sunt încă plătibile.",
    reserve: "Rezervă 20%",
    reserveNote: (date: string) => `Se eliberează pe ${date}`,
    available: "Disponibil de retras",
    withdraw: "Retrage fondurile",
    timeline: "Evoluție pe 30 de zile",
    recentCampaigns: "Campanii recente",
    table: {
      campaign: "Campanie",
      views: "Vizualizări validate",
      amount: "Sumă",
      status: "Status",
    },
    status: {
      paid: "Plătit",
      scheduledDay7: "Programat — ziua 7",
      scheduledDay14: "Programat — ziua 14",
      reserved: "În rezervă",
      underReview: "În verificare",
    },
  },
  assistant: {
    title: "Asistent de conținut",
    subtitle: "Cunoaște stilul tău și brief-ul campaniei.",
    placeholder: "Întreabă orice despre o campanie sau despre un clip…",
    send: "Trimite",
    basedOn: (date: string) => `pe baza clipului tău din ${date}`,
    suggestions: [
      "Idei de început pentru clip",
      "Ce campanii mi se potrivesc?",
      "Verifică-mi planul",
    ],
  },
  brand: {
    welcome: (name: string) => `Bun venit, ${name}`,
    subtitle: "Performanța campaniilor tale, în timp real.",
    newCampaign: "Campanie nouă",
    activeCampaigns: "Campanii active",
    totalReach: "Reach total",
    totalSpent: "Buget cheltuit",
    totalViews: "Vizualizări totale",
    activeCreators: "Creatori activi",
    verifiedActive: "Verificați și activi",
    campaignPerformance: "Performanța campaniilor",
    viewAll: "Vezi tot",
    budgetUsed: "Buget consumat",
    effectiveCpm: "CPM efectiv realizat",
    leaderboard: "Clasamentul creatorilor",
    table: {
      campaign: "Campanie",
      status: "Status",
      budget: "Buget",
      views: "Vizualizări",
      creator: "Creator",
      earned: "Încasat",
    },
    status: { active: "Activă", draft: "Ciornă", closed: "Închisă" },
  },
  common: {
    demoData: "date demo",
    vsLastMonth: "față de luna trecută",
    notifications: "Notificări",
    search: "Caută",
    loading: "Se încarcă…",
  },
} as const;

export type Dictionary = typeof ro;

/** Single access point for copy. Swap the locale here when a second one lands. */
export const t: Dictionary = ro;

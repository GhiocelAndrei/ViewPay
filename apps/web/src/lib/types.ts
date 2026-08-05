// Hand-written mirrors of the backend DTOs. TODO: replace with types generated from the OpenAPI
// spec (packages/contracts) — until then these must be kept in sync with Vira.Abstractions/DTOs.

export interface Me {
  accountId: string;
  email: string;
  type: "Creator" | "Business";
  businessId?: string | null;
  companyName?: string | null;
  onboardingComplete: boolean;
}

export type CreatorCategory =
  | "Food" | "Sport" | "Tech" | "Beauty" | "Travel"
  | "Comedy" | "Education" | "Lifestyle" | "Gaming" | "Music";

export type CampaignObjective = "Awareness" | "Visits" | "Offer" | "Launch" | "Community";
export type CampaignStatus = "Draft" | "Active" | "Closed";
export type CompanySize = "Solo" | "Small" | "Medium" | "Large";
export type BudgetBand = "Under1k" | "From1kTo5k" | "From5kTo20k" | "Over20k";
export type AudienceAge = "Teens" | "A18_24" | "A25_34" | "A35_44" | "A45Plus";

export interface CampaignDto {
  id: string;
  title: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  budgetMinor: number;
  spentMinor: number;
  views: number;
  createdAt: string;
}

export interface CreateCampaignDto {
  title: string;
  objective: CampaignObjective;
  budgetMinor: number;
  hashtags: string[];
  mention?: string | null;
  durationPreset: string;
  requirements: string[];
  productPlacement: boolean;
  minFollowerThreshold: number;
  extraRequirements: string;
  message: string;
}

export interface BusinessProfileDto {
  companyName: string;
  verticals: CreatorCategory[];
  companySize: CompanySize;
  budgetBand: BudgetBand;
  targetAudienceAges: AudienceAge[];
  primaryGoal: CampaignObjective;
  avoidsAlcohol: boolean;
  avoidsGambling: boolean;
  avoidsPolitical: boolean;
  description: string;
  values: string[];
  website: string;
  competitorBrands: string[];
  productsToPromote: string;
}

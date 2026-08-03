import { create } from "zustand";
import { brandCampaigns, type BrandCampaignRow } from "@vira/core";

/**
 * The campaign list the brand sees.
 *
 * Seeded from fixtures and extended by the creation flow, so a campaign made in
 * the wizard actually appears in the dashboard table instead of vanishing on
 * submit. Demo state only — deliberately NOT persisted, because a half-real
 * list surviving a refresh is more confusing than one that resets.
 *
 * TODO(api): delete this once `GET /brand/campaigns` and `POST /brand/campaigns`
 * exist; the components already read a list and append to it, so the swap is a
 * change of source, not of shape.
 */
interface BrandCampaignsState {
  rows: BrandCampaignRow[];
  add: (row: BrandCampaignRow) => void;
}

export const useBrandCampaigns = create<BrandCampaignsState>((set) => ({
  rows: brandCampaigns,
  add: (row) => set((state) => ({ rows: [row, ...state.rows] })),
}));

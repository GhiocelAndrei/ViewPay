import { create } from "zustand";

/**
 * What the creator has told the feed not to show.
 *
 * Dismissing is not just a hide: it is the only signal the matcher gets from
 * ordinary browsing, since applying is rare and scrolling past is ambiguous. The
 * onboarding quiz builds the initial profile; this is what keeps it current.
 *
 * Undo exists because a mis-tap on a scrolling feed is common, and a creator who
 * cannot take back a dismissal learns not to use the button at all.
 *
 * TODO(api): POST the signal to the gateway so the matcher actually learns from
 * it — today it only filters this session's list.
 */
interface FeedPreferencesState {
  dismissed: string[];
  dismiss: (campaignId: string) => void;
  restore: (campaignId: string) => void;
  restoreAll: () => void;
}

export const useFeedPreferences = create<FeedPreferencesState>((set) => ({
  dismissed: [],
  dismiss: (campaignId) =>
    set((state) =>
      state.dismissed.includes(campaignId)
        ? state
        : { dismissed: [...state.dismissed, campaignId] },
    ),
  restore: (campaignId) =>
    set((state) => ({ dismissed: state.dismissed.filter((id) => id !== campaignId) })),
  restoreAll: () => set({ dismissed: [] }),
}));

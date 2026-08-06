import { useQuery } from "@tanstack/react-query";
import { ApiError, getJson } from "./api";
import type { CampaignDto, Me } from "./types";

/** Current session from the gateway. Resolves to `null` when signed out (401), never throws on 401. */
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<Me | null> => {
      try {
        return await getJson<Me>("/auth/me");
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null;
        throw e;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}

/** The signed-in business's campaigns. */
export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getJson<CampaignDto[]>("/brand/campaigns"),
  });
}

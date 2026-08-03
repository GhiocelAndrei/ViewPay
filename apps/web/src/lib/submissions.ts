import { create } from "zustand";
import {
  clipSubmissions,
  type ClipSubmission,
  type DecidedSubmission,
  type RejectionReasonId,
} from "@vira/core";

/**
 * The approval queue.
 *
 * A decision moves a submission from `pending` to `decided` — it is never
 * mutated in place and never silently dropped, so the screen can always show
 * what was decided and why. A rejection without a reason is not representable:
 * `reject` takes both arguments, and the UI cannot call it without them.
 *
 * Demo state, not persisted. TODO(api): back this with
 * `GET /brand/submissions` + `POST /brand/submissions/{id}/decision`.
 */
interface SubmissionsState {
  pending: ClipSubmission[];
  decided: DecidedSubmission[];
  approve: (id: string) => void;
  reject: (id: string, reasonId: RejectionReasonId, note: string) => void;
}

function record(
  submission: ClipSubmission,
  decision: DecidedSubmission["decision"],
  reasonId?: RejectionReasonId,
  note?: string,
): DecidedSubmission {
  return {
    id: submission.id,
    campaignName: submission.campaignName,
    creatorHandle: submission.creatorHandle,
    decision,
    reasonId,
    note,
  };
}

export const useSubmissions = create<SubmissionsState>((set) => ({
  pending: clipSubmissions,
  decided: [],

  approve: (id) =>
    set((state) => {
      const submission = state.pending.find((item) => item.id === id);
      if (!submission) return state;
      return {
        pending: state.pending.filter((item) => item.id !== id),
        decided: [record(submission, "approved"), ...state.decided],
      };
    }),

  reject: (id, reasonId, note) =>
    set((state) => {
      const submission = state.pending.find((item) => item.id === id);
      if (!submission) return state;
      return {
        pending: state.pending.filter((item) => item.id !== id),
        decided: [record(submission, "rejected", reasonId, note), ...state.decided],
      };
    }),
}));

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { postJson } from "./api";
import { firebaseAuth } from "./firebase";
import type { Me } from "./types";

/**
 * Brand auth flow (BUILD_PLAN D5): authenticate with Firebase on the client, then hand the ID
 * token to the gateway, which verifies it and sets the HttpOnly session cookie. The Firebase
 * client session itself is incidental — the backend cookie is what authorizes API calls.
 */

export async function registerBrand(email: string, password: string): Promise<Me> {
  const cred = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
  return exchange(await cred.user.getIdToken());
}

export async function loginBrand(email: string, password: string): Promise<Me> {
  const cred = await signInWithEmailAndPassword(firebaseAuth(), email, password);
  return exchange(await cred.user.getIdToken());
}

export async function logout(): Promise<void> {
  await postJson<void>("/auth/logout");
  try {
    await firebaseSignOut(firebaseAuth());
  } catch {
    // Firebase client sign-out is best-effort; the backend cookie is already cleared.
  }
}

function exchange(idToken: string): Promise<Me> {
  return postJson<Me>("/auth/firebase", { idToken });
}

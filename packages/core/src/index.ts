/**
 * @vira/core — everything both apps agree on.
 *
 * Rule of thumb: if it is plain TypeScript, it belongs here. If it renders, it
 * belongs to an app — `apps/web` draws with DOM + Tailwind, `apps/mobile` with
 * React Native primitives, and a component that tries to serve both ends up
 * serving neither well.
 */
export * from "./money";
export * from "./i18n";
export * from "./fixtures";
export * from "./roles";
export * as tokens from "./tokens";

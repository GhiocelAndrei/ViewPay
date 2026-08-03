# Vira — handoff

Read this first, then `CLAUDE.md` (engineering rules, loads automatically) and
`BUILD_PLAN.md` (architecture decisions, D0–D14). Everything below is current as of
**3 August 2026**.

---

## 1. What Vira is

A marketplace connecting **small local businesses** with **TikTok creators**, where the
business pays **per verified view** — not per post, not on estimates.

The positioning matters and shows up in the copy: this is for the businesses that have
never advertised (a neighbourhood gym, a bakery, a barber) and for creators with a few
thousand followers who never get deals. Barriers removed, stated on the landing page:
**€300 minimum budget · 1.000 followers · 0 € cost for creators.** The client also wants
big brands and established influencers to feel welcome — do not write copy that excludes
them.

**How it works:** business funds a budget → creators apply → creator uploads the clip to
Vira for approval → business approves → **creator posts natively on TikTok** → Vira
detects the post, measures views through the official Display API, validates them against
fraud rules, and pays out in tranches. Unspent budget is returned.

---

## 2. Commercial context

- **Client:** Filip (co-founder Sami, a well-known artist — the launch channel). Declared
  a ~€700k budget for the app; treat that as unconfirmed until money moves.
- **Team:** 3 people full-time, 13 weeks. Robert (frontend), Ghiocel/"Ghio" (backend),
  plus an AI specialist. Internal split of the fee: 30k / 30k / 20k — **never appears in
  client documents**.
- **Contract:** €80.000 fixed, milestone-based — €6.000 on signing, €20.000 at day 30
  (demo), €27.000 at day 60 (money flows end to end), €27.000 at day 90 (pilot-ready,
  iOS submitted to Apple).
- **Scope is frozen** for the 13 weeks. New ideas are noted and land after day 90.
- A revenue-share **percentage** is under discussion as "the second half of the real
  price" — recommendation on file: 3–5% of platform revenue over 4–5 years, capped, in
  preference to equity.

Client-facing documents live in `~/Downloads`: `calendar.docx`, `demo.docx`,
`ViewPay-Functionalitati.docx`, `ViewPay-Raspuns-Document-Produs.docx`,
`ViewPay-Comparatie-2-vs-3.docx`. They still carry the old name in the filenames.

> **The product was renamed ViewPay → Vira.** The code and the app are Vira. Some
> client documents still say ViewPay; that is pending, not a mistake to replicate.

---

## 3. Where the code is

**Repo:** `C:\Users\roby_\Desktop\Vira` (moved from `source/repos`; do not recreate it
there). Remote: `github.com/GhiocelAndrei/Vira`.

```
apps/web/       React + Vite + TS + Tailwind — THE app. Landing + creator + brand.
apps/mobile/    Expo + React Native + NativeWind — PARKED. Native port, derived later.
packages/core/  money, i18n, roles, tokens, fixtures — plain TS, renderer-agnostic.
packages/contracts/  types generated from the .NET OpenAPI spec (not wired yet)
backend/        .NET 10 — skeleton only, logic stubbed with TODOs
ai-service/     Python + FastAPI + Anthropic SDK — skeleton only
```

```bash
npm install          # ALWAYS from the repo root — it is an npm workspace
npm run web          # :5173 — start here
npm run typecheck    # every workspace
```

### What actually works today

The **web app is fully built and runs**, on mock data from `packages/core/src/fixtures.ts`.
There is no backend wired up yet — no API calls, no auth, no database.

| Route | State |
|---|---|
| `/` | Landing — hero, barriers strip, "for whom" (two audiences), open campaigns, how it works, for-business section, footer |
| `/intra` | Sign-in — two doors, creator and business. Sets a local role; no real auth. |
| `/feed` | Creator home — vertical **scroll-snap** feed of campaign cards (no video). Each card: brand mark, quoted hook, rate, estimated earnings, budget left, slots, match %, save/share rail. |
| `/campanii` | Marketplace — brief chips, expandable "why it matches", one card locked behind a 35k-follower threshold |
| `/profil` | AI portrait — archetype, 8 style dimensions, **evidence cards** (each claim + its clip and timestamp), growth tip |
| `/castiguri` | Earnings — month total, pending validation / 20% reserve / available, 30-day chart, payout rows |
| `/asistent` | Content assistant — chat UI, canned thread |
| `/brand` | Brand dashboard — live view counter, stat tiles, budget, campaign table (reflows to cards on phones), creator leaderboard |

Roles: `guest | creator | brand`, persisted in localStorage via Zustand, with route guards.
**This is presentation state, not security** — the gateway must re-check every request.

### Design system

"Lumina Dark", from a Google Stitch export. Tokens live in `packages/core/src/tokens.ts`
and are imported by the Tailwind config — a colour changes in one place. Near-black
`#0E0F13`, one accent (electric violet `#cabeff`), glassmorphic depth, Geist / Inter /
JetBrains Mono. Money and view counts are the most legible things on any screen.

---

## 4. Decisions that already flip-flopped — do not re-open

These were argued through and settled. Re-litigating them wastes the client's time.

| Question | Settled answer |
|---|---|
| Publishing to TikTok | **Creators post natively.** No Content Posting API, no TikTok audit dependency. Vira detects the post afterwards (pasted link or automatic detection — that UX choice is still open). |
| Guaranteed minimum per post | **Removed.** Payment is purely per validated view. |
| iOS strategy | Changed twice: Capacitor → two parallel apps → **web first, one app, native derived from it later**. `apps/mobile` is parked. |
| Brand on mobile | Brands get **full parity in a phone browser**. No brand app in the App Store, which keeps campaign funding outside Apple's IAP rule. |
| Identity in the app chrome | Signed-in user's name + role sits **top-left**; the header carries no duplicate. |
| Name | Vira (was ViewPay). |

---

## 5. Open decisions — do not resolve silently

1. **Currency.** Product documents quote EUR; `Money.cs` documents itself as RON *bani*.
   Romanian invoicing (e-Factura) and PFA payouts are RON, and a neighbourhood business
   thinks in lei — which strengthens the RON case. One constant in
   `packages/core/src/money.ts` (`CURRENCY_SYMBOL`) plus the C# type. **Blocks payout code.**
2. **Post capture:** pasted link vs. automatic detection. Same API access either way.
3. **Clip source for the AI portrait.** The TikTok API returns metadata and cover images,
   never video files. Working assumption: the creator uploads 3–5 clips at onboarding,
   enriched from campaign data over time. Validate early.
4. **Match percentages.** The feed shows "87% potrivire" because the client's mockup did,
   but the product document says no percentages until there is calibration data. One line
   in `FeedCampaign` to switch to "se potrivește / merită încercat".
5. **Native port route** — React Native vs. wrapping the built SPA. Deferred until the web
   app is settled.

---

## 6. Traps that already cost time

- **Install only from the repo root.** Installing inside `apps/*` nests `react-native` or
  `tailwindcss`, and NativeWind's `declare module "react-native"` then augments a copy the
  code does not import — every `className` silently loses typing. Both apps are pinned to
  **React 19** and **Tailwind 3** for the same reason.
- **Money is integer minor units everywhere**, including intermediate maths and the
  frontend. `packages/core/src/money.ts` splits with `(value - value % 100) / 100`, never
  `value / 100`, because the naive form introduces float error.
- **UI copy is Romanian and lives in `packages/core/src/i18n.ts`.** Code, identifiers and
  comments stay English. Never hardcode a user-facing string.
- Verify Word deliverables with `pdftoppm` (poppler is installed) after exporting via Word
  COM — not the browser pane.

---

## 7. What comes next

**Immediately useful, roughly in order:**

1. **Fonts.** Geist / Inter / JetBrains Mono are loaded on web via Google Fonts; confirm
   they render, and note that the parked Expo app needs `expo-font` instead.
2. **Ask Ghio for DTOs and controller signatures returning stub data.** One day of his
   time unblocks weeks: the OpenAPI spec is what generates the frontend types. Today
   `PortraitDto` has only `StyleVector` + `NarrativeDossier`, while the portrait screen
   renders claims with evidence — that divergence becomes rework if left.
3. **MSW mocks against the real contract**, so components call `/api/...` exactly as they
   will in production and the mock layer is deleted, not unwound.
4. **Campaign creation flow for brands** — the five-objective picker, budget with live
   preview, requirements builder. Designed but not built.
5. **Content approval queue** — brand reviews an uploaded clip, automatic checks, approve
   or reject with a mandatory factual/legal reason.
6. **The ~30 example clips** from the client, for the feed. Ask for them in week 1.

**Not started at all:** backend logic, ai-service logic, real auth, TikTok integration,
payments, the measurement worker.

---

## 8. How to brief a new session

Point it at this file, then let `CLAUDE.md` (auto-loaded from the repo root) carry the
engineering rules and `BUILD_PLAN.md` the architecture decisions. Say what you want to
build; the state above is enough to start without re-explaining the product.

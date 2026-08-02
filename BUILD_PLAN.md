# ViewPay — Build Plan (Demo, 4 weeks)

**Scope:** Demo-as-foundation. Build the 4-week demo so every stack choice extends
directly into the full 13-week / €80k program (day 60 = money flows, day 90 = pilot).
No throwaway code.

**Demo must show (from demo.docx):**
- Browsable web app, desktop-first (like TikTok desktop), also works on phone
- TikTok-style vertical video **feed** (~30 example ad clips), scroll + sound
- **Live TikTok login** (OAuth) → creator's real clips + real view counts
- **AI Creator Portrait** — generated from clips, every claim backed by a clip
- **Campaigns feed** — brief + explained match; product-placement locked below follower threshold
- **AI Assistant** — style-aware ("how would I make a clip for this campaign?")
- **Business side** — separate account; create campaign (brief/budget/access rules);
  dashboard with a real test clip whose views climb **live**; full campaign with
  budgets/payouts on **simulated** data marked "demo"

**Real vs. simulated boundary (frozen):**
- REAL/LIVE: TikTok connection, clips + view counts, AI portrait, live test-clip views,
  campaign creation & access rules
- SIMULATED (marked "demo"): card payments & money movement, calculated budgets/payouts,
  antifraud validation

---

## Decisions log

### D0 — Scope & philosophy ✅
Demo as foundation. Optimize for the demo scenario, but no throwaway architecture.

### D1 — Architecture shape ✅
Separate services, but with a **central .NET backend as the brain + API gateway**.
Not fully-independent peer services — a hub-and-spoke around .NET.

**Shape:**
- `frontend/` — pure UI (SPA), no business logic
- `backend/` (.NET) — business logic + API gateway/orchestrator; the only thing the
  frontend talks to; fronts the satellite services
- Satellite services behind the gateway: `tiktok-service`, `ai-service`, AI-pipelines
- **Monorepo** containing frontend, backend, services, shared contracts
- **Data:** one Postgres, **schema-per-service** (tiktok.*, ai.*, campaigns.* …);
  extract to per-service DBs later
- **Transport:** HTTP/REST for request-response; message queue only where the doc
  demands async (AI pipeline, view-count polling)

**Runtime per piece (locked):**
- `ai-service` + AI-pipelines → **Python (FastAPI)** — native home for Anthropic SDK,
  multimodal, ffmpeg/OpenCV frames, Whisper transcription
- **TikTok → a module inside the .NET backend** (OAuth, Display API, 24h token refresh,
  view polling via a background hosted service). Not a separate deployable. Extract later if needed.

**Result: 3 deployables.**
```
monorepo/
  frontend/            UI only (SPA)
  backend/             .NET — business logic + API gateway
                         └ TikTok module (OAuth, Display API, polling)
  ai-service/          Python/FastAPI — IAiModelClient, Portrait, Assistant, pipelines(stub)
  packages/contracts/  shared types/DTOs
  (Postgres: schema-per-service)

frontend → backend(.NET gateway) → ai-service (HTTP; queue for async pipeline)
                                 └ TikTok API (direct, from TikTok module)
```

### D2 — Frontend stack ✅
Pure UI SPA. **React + Vite + TypeScript.**
- Routing: React Router · Server state: TanStack Query (also powers live-view polling)
- Client state: Zustand · Forms: React Hook Form + Zod · Charts: Recharts
- **UI/styling: shadcn/ui + Tailwind** (own the component code; distinctive, non-templated)
- Video feed: HTML5 `<video>` + IntersectionObserver + CSS scroll-snap for our ~30
  example clips; TikTok creator clips via TikTok `embed_link`
- API types generated from the .NET OpenAPI spec (stay in sync with gateway)

### D3 — Backend stack (.NET brain/gateway) ✅
- Runtime **.NET 8 (LTS)** · ASP.NET Core · **Controllers (MVC)** · OpenAPI/Swagger
- **Layered architecture (team convention): `Api → Application → DataAccess → Abstractions`**
  ```
  backend/src/
    ViewPay.Api/            Controllers = the API gateway; Program.cs; auth; Swagger
    ViewPay.Application/    Interfaces, Services (AI + TikTok HttpClients), Mapping (AutoMapper),
                           Validations (FluentValidation), ApplicationExtensions.AddApplication(conn)
    ViewPay.DataAccess/     EF Core DbContext, Migrations, DataAccessExtensions.AddDataAccess(conn)
    ViewPay.Abstractions/   Models (entities), DTOs, Settings, Constants, Common — the shared leaf
  ```
  Abstractions is referenced by all; external-service clients (AI, TikTok) live in
  Application/Services (pooled HttpClient), so there is no separate Infrastructure project.
  Note: scaffolded on **.NET 10** (installed LTS) rather than net8.0.
- Data access: **EF Core** (migrations, schema-per-service) **+ Dapper later** for money-ledger hot paths
- Validation: FluentValidation · Background: Hosted `BackgroundService` (+ Hangfire if needed)
- Money: integer-only in **bani** (`long`), never floats (dev-doc non-negotiable)

### D4 — Data model ✅
Postgres, schema-per-service. Core entities:
- `identity`: Account (type Creator|Business), Session
- `creators`: Creator, TikTokConnection (access/refresh token, expires_at), CreatorClip
  (cached from video.list), CreatorPortrait, **PortraitClaim (statement + evidence→clip+timestamp)**
- `campaigns`: Business, Campaign (structured brief, budget_bani), CampaignAccessRule
  (min_follower_threshold, product_placement), CampaignStyleVector, Match (score, factors, explanation)
- `media`: FeedClip (~30 example ads), TestClip, **ViewSnapshot (append-only, gaps marked not interpolated)**
- `ai`: AssistantConversation/Message, AnalysisResult (stub seam for day-60)
- `billing`: SimulatedPayout, CampaignBudgetLine — all `is_demo=true`

**Modeling:**
- AI outputs (style vector, factors[], evidence[]) stored as **versioned JSONB** + model/prompt/
  ontology version columns; matches score contract `{value?, confidence, factors[], evidence[]}`.
  `PortraitClaim` stays a real table to enforce "no claim without evidence."
- TikTok clips: **fetch live on login (keeps 'live' promise) + cache** in Postgres for portrait/matching.

### D5 — Auth & accounts ✅
Two front doors converging on **one backend HttpOnly session cookie** (the gateway's single
source of truth). JS never holds a token.
- **Business → Firebase Auth** (email/password; Firebase handles hashing/reset/lockout).
  SPA gets Firebase ID token → `POST /auth/firebase` → backend **verifies via Firebase Admin
  SDK (FirebaseAdmin NuGet)** → issues HttpOnly cookie. No ASP.NET Core Identity needed.
- **Creator → TikTok OAuth only** (Login Kit). Backend exchanges the code (TikTok module) →
  issues HttpOnly cookie. TikTok tokens stored server-side in `creators.TikTokConnection`.
- Both map to `identity.Account` (type Creator|Business) + `Session`; frontend routes by type.
- Dependency note: Firebase Auth adds one Google cloud dependency (fine for demo+pilot).

### D6 — TikTok integration ✅ (.NET TikTok module)
- **Login Kit + Display API only** (no Content Posting API).
- Scopes: `user.info.basic`, `user.info.profile`, **`user.info.stats`** (follower_count for the
  campaign gate), `video.list`.
- Endpoints: `/v2/oauth/token/`, `/v2/user/info/`, `/v2/video/list/` (clip feed),
  `/v2/video/query/` (poll test clip).
- Tokens: 24h access / ~365d refresh; **background HostedService refreshes before expiry + alerts**;
  stored encrypted at rest (ASP.NET Data Protection).
- **Live views: no webhooks → queue worker polls `video.query` every ~10-15s**, writes
  **append-only `ViewSnapshot` (raw, gaps marked, not interpolated)**; **UI tweens** the number
  between real snapshots so it feels continuously live.
- Env: **Sandbox + client TikTok accounts as test users** (Display-only → no audit). Active User
  Cap increase filed before pilot.
- ⚠ Demo-execution risk: TikTok view stats update with latency; test clip posted demo-morning so
  views accrue over hours (not seconds) — set audience expectation accordingly.

### D7 — Video handling ✅
- **We host only the ~30 example feed clips.** Creator clips + test clip render via TikTok
  `embed_link`/cover images — never stored by us.
- Storage: **Firebase Storage (GCS) + CDN**; frontend plays direct via public/signed URLs
  (not proxied through .NET). Consolidates on Firebase (already auth). **Originals stay
  accessible to the Python AI pipeline later** (frame extraction, fingerprinting).
- Prep: one-time `ffmpeg` web-optimize (H.264, faststart, capped resolution). Playback via
  HTML5 `<video>` + IntersectionObserver + scroll-snap (no HLS needed at this volume).
- Google footprint now: Firebase Auth + Firebase Storage → informs hosting (D12).

### D8 — AI layer (ai-service, Python/FastAPI) ✅
**IAiModelClient** black-box contract (Python Protocol/ABC); primary impl = Anthropic SDK.
Every lane swappable later (Gemini / Fable 5 / local).

**Full task router (4 lanes):**
| Lane | Model | Demo status |
|---|---|---|
| Vision (cover images now; frames later) | `claude-opus-4-8` (multimodal, high-res) | **active** — ~20 cover thumbnails |
| Creative/brand reasoning (portrait synthesis, brainstorm) | `claude-opus-4-8`, adaptive thinking, effort high | **active** |
| Compliance / normalization (light, cheap) | `claude-haiku-4-5` | active (light use in demo) |
| Audio transcription | local **Whisper** (faster-whisper) | **stubbed** — day-60 pipeline |

**API mechanisms → dev-doc mandates:**
- **Structured Outputs** via `client.messages.parse()` + **Pydantic** models enforce the score
  contract `{value?, confidence, factors[], evidence[]}`; `PortraitClaim.evidence` is a required
  field → "no claim without evidence" enforced by schema.
- **Prompt caching** on stable system prompt + ontology + rubrics; volatile creator clips after
  the cache breakpoint (the §19.2 cost lever).
- **Adaptive thinking** (`effort: high`) for portrait/brainstorm; none for Haiku compliance.
- Every output stamps model/prompt/ontology version into JSONB (D4) → reproducible.
- Demo portrait built from **clip metadata + real view stats + cover-image vision**; full
  frame/transcription analysis is the stubbed day-60 seam.
- Eval: **small eval set** for the demo (not the full 100-creator gold set — §19.6).

**AI Assistant:** plain **Messages API multi-turn** — system prompt + cached portrait + campaign
brief as context, streamed responses, history in `ai.AssistantConversation`. No Managed Agents.

### D10 — Matching engine (.NET) ✅
Ranked list, **matching is information not a gate**; honors **absolute veto** (mocked
category / praised competitor → 0%, from portrait ontology tags) and the **follower-threshold
lock** on product-placement campaigns.
- **Score = deterministic .NET math**: cosine similarity of the two 8-dim style vectors (from
  Postgres JSONB) + factor breakdown. Follower gate = pure rule.
- **Explanation = AI-generated, grounded**: .NET computes score+factors → ai-service (Opus) writes
  a short NL "why it fits" grounded in factors + style tags (no claim without evidence). Cacheable.
- **Factors for demo:** REAL = creative compat (vector similarity), audience compat (niche/geo),
  budget fit (cap/slots), veto rule. **Seeded + labeled "building"** = history on similar
  campaigns, reliability, conformance probability (shown as accruing, not fabricated).

### D11 — Simulated money layer (.NET Domain) ✅
Build the **full Bloc 1 calculation/ledger logic now** (all simulated), not just a minimal calc.
- **In (real logic, simulated data):** integer **bani** (`long`, never floats); payout =
  views × cost-per-view; budget draw-down/remaining; **80%/20% staged payout** (80% on-progress,
  20% released at 30 days); **30-day reserve** modeling; **per-creator caps at non-round values**
  (anti-fraud); **append-only audit ledger** independent of TikTok; **human approval on payout batch**.
- **Out (day-60):** Stripe/card rails, real money movement, functional antifraud validation,
  e-Factura/DAC7/tax. All money rows `is_demo=true` + UI "demo" badge.
- ⚠ Timeline flag: this is beyond demo.docx's minimal scope (which defers tranches/reserves/caps
  to day-60). Chosen for foundation strength; adds build weight in the 4 weeks. Risk bounded —
  pure calculation/ledger, no payment rails.

### D12 — Infra & deployment ✅
**Split hosting across 3 clouds:**
- **Frontend (React SPA) → Vercel** (CDN, instant deploys, preview envs).
- **Backend (.NET) + ai-service (Python) → Azure Container Apps.**
- **Postgres → Azure Database for PostgreSQL (Flexible Server).**
- **Firebase Auth + Storage → Google** (stays, per D5/D7).
- **Secrets → Azure Key Vault** (Anthropic key, TikTok secret, Firebase admin, DB creds).
- **CI/CD → GitHub Actions** (monorepo, path-filtered per service).
- Local dev: **Docker Compose + Firebase emulators**.

**⚠ Cross-origin auth callout (interacts with D5):** Vercel frontend and Azure backend are
different origins. To keep the **HttpOnly cookie session** first-party and simple (SameSite=Lax),
put both under **one registrable domain** — e.g. `app.viewpay.com` (Vercel) + `api.viewpay.com`
(Azure), cookie `Domain=.viewpay.com`. If we ship on default `*.vercel.app` + `*.azurecontainerapps.io`
domains instead, cookies must be **SameSite=None; Secure** with credentialed CORS pinned to the exact
frontend origin. **Recommend the custom-domain path** to preserve the D5 security model.

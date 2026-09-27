# PRD.md — Project Maps (Detailed Location & Navigation Platform) + Implementation Plan

Source domain: `Product Requirements Document — Detailed Location & Navigation Platform.md` (PRD v1, 1356 lines).
North Star: **Can a person who has never been to this place find it without having to call someone for directions?**
Core loop: **Discover → Describe → Navigate → Verify → Share**
Concept: **PLACE + PEOPLE + DIRECTIONS + CONDITIONS**

> **Local-run note (binding for now): App + database run locally. No production deployment required at this stage.**
> Next.js runs via `npm run dev` on localhost. PostgreSQL runs via Docker Compose on localhost. No Neon/Supabase cloud project, no Vercel deploy, no R2 prod bucket required to complete these phases. Cloud names below are targets, not requirements now.

## 1. Stack (do not deviate)

- **Framework:** Next.js 14+ (App Router), TypeScript `strict: true`, Tailwind CSS, shadcn/ui + Radix for components.
- **Database:** PostgreSQL with Prisma ORM. Prod target: Neon or Supabase Postgres. Local now: PostgreSQL 16 via Docker Compose + Prisma to `localhost:5432`.
- **Auth:** Auth.js v5 (NextAuth) with Email provider + Google OAuth. Store `role` on session/JWT (`CUSTOMER | QUBATORS_ADMIN | CONSULTANT`), enforce via `middleware.ts` + server-side `auth()` checks.
- **File storage:** S3-compatible (Cloudflare R2 or Supabase Storage). Buckets/prefixes: `reference-photos/`, `design-attachments/`, `progress-photos/`, `portfolios/`, `avatars/`. Local now: S3-compatible shim (local S3 e.g. MinIO via Docker, or file-system adapter behind same interface) — no cloud bucket required.
- **Payments:** Paystack primary (Nigeria-first) behind a `PaymentProvider` interface so Flutterwave/Stripe can be added later without rewriting order logic. Support full payment + installment plans + webhook handling (`/api/webhooks/paystack`). Local now: interface + stub/test-mode only, no live charges.
- **Email:** Resend for transactional mail (receipts, reminders, approvals). Local now: Resend in test/dev key mode or console log fallback; no prod domain required.
- **SMS/WhatsApp:** Out of scope for Phase 1. In-app + email only for now. Tracked as Phase 1.5 addition.

### Scope-flag (must read)

The requested auth roles (`CUSTOMER`, `QUBATORS_ADMIN`, `CONSULTANT`) and payments/installments, consultant portfolios/avatars, design attachments, and progress photos do **not** exist in the maps PRD v1, whose roles are Visitor / Resident / Business Owner / Property Manager / Community Contributor and which has no checkout flow.

Decision for this plan: implement the requested stack verbatim, and map it onto the maps domain as follows (no silent renaming):

- `CUSTOMER` = any Visitor/Resident/Business Owner seeking or owning a location.
- `CONSULTANT` = trusted contributor/verifier analogue (community contributor, resident verifier). No consulting-booking semantics unless product scope changes.
- `QUBATORS_ADMIN` = moderator/ops (reviews claims, corrections, alerts).
- Payments (`Order`, `Payment`, installments) and portfolio buckets are scaffolded as schema + interface + stub only. No checkout UI is built until a maps use case for paid profiles is approved, because PRD §38 says no heavy monetization at launch.

If the product is actually changing from maps to a services-marketplace (Qubators), the domain sections below need a rewrite — flagging this now per your do-not-deviate rule.

## 2. Ordered phases with concrete outputs

### Phase 0 — Local foundation (repo + toolchain)

Concrete outputs:
- `package.json`: `next@14+`, `typescript strict`, `tailwindcss`, `prisma`, `next-auth@5`, `@aws-sdk/client-s3`, `resend`.
- `docker-compose.yml`: services `db` (postgres:16, volume `pgdata`, port 5432) and optional `s3` (MinIO) for local storage shim.
- `.env.example` + `.env.local`: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_maps`, `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, `EMAIL_FROM`, `RESEND_API_KEY`, `S3_ENDPOINT/BUCKET/KEYS`, `PAYSTACK_SECRET_KEY` (test), `PAYSTACK_WEBHOOK_SECRET`.
- `prisma/schema.prisma`: datasource postgres, generator client. Initial models: `User`, `Account`, `Session`, `VerificationToken` (Auth.js), plus `Location`, `LocationPhoto`, `Alert` (defined in Phase 2/5).
- Commands that must pass: `npm install`, `docker compose up -d db`, `npx prisma migrate dev --name init`, `npx prisma generate`, `npm run dev`, `npx tsc --noEmit`.

Done when: `npm run dev` renders, Prisma connects to local Postgres, no cloud services touched.

### Phase 1 — Auth + roles + single local page (your immediate need)

Concrete outputs:
- `auth.ts` (Auth.js v5): Email + Google providers, JWT/session callback copying `user.role` onto `session.user.role`.
- `prisma/schema.prisma`: `enum Role { CUSTOMER QUBATORS_ADMIN CONSULTANT }`, `User.role` default `CUSTOMER`.
- `middleware.ts`: matcher on `/admin/:path*`, `/consultant/:path*`, `/api/admin/:path*`; reads session role, redirects/forbids non-matching roles.
- `lib/requireRole.ts`: `requireRole(session, [...])` helper used in every server action/route handler.
- `app/(public)/page.tsx`: single working local page — hero ("From the road to the door"), search input (stub → filters local seed locations), featured Location Card (name, address, final directions, look-for, verification badge), shadcn `Card/Input/Button/Badge`.
- `app/layout.tsx`: Tailwind + shadcn theme, header with sign-in/out (`SignIn`/`UserButton` via Auth.js).
- Seed: `prisma/seed.ts` inserts 3 locations (e.g. BUZZ-style studio, Greenview Estate gate, shop-in-mall) + 1 user per role.
- Auth checks: `GET /api/health` public; `GET /api/admin/health` requires `QUBATORS_ADMIN`; manual test logs in as each role.

Done when: on localhost you can sign in (email link or Google test client), see your role in session, hit the single page, and role-gated routes reject correctly.

### Phase 1.5 — SMS/WhatsApp (deferred, tracked)

Concrete outputs (not built now): `lib/notify.ts` interface with `sendInApp()` + `sendEmail()` implementations only; `sendSms()`/`sendWhatsapp()` throw `NOT_IMPLEMENTED`. Backlog file `NOTIFY_TODO.md` listing provider candidates and webhook needs.

### Phase 2 — Location core: create / search / view / share

Maps PRD §7–§10, §22–§25.

Concrete outputs:
- Prisma: `Location(id, name, category, address, description, entrance, finalDirections, verificationStatus, parentId?, lat?, lng?, createdById, updatedAt)`, `LocationPhoto(id, locationId, tag, url, createdById)` with `tag ∈ turn_here|entrance|building|parking`.
- API: `GET /api/locations?q=`, `POST /api/locations`, `GET /api/locations/[id]`, `PATCH /api/locations/[id]` (Zod validation, `requireRole` for writes).
- UI (App Router, shadcn `Form/Dialog/Card`):
  - `app/locations/new/page.tsx`: 4-step wizard (Identify → Reach → Visuals → Confirm).
  - `app/locations/[id]/page.tsx`: Location Profile (name, category, address, entrance, final directions, landmarks, photos, verification badge, last updated).
  - `components/LocationCard.tsx` + `components/ShareButtons.tsx`: WhatsApp/SMS/Messenger/copy-link share producing deep link `/l/[id]`.
  - `app/l/[id]/page.tsx`: public share landing.
- Search: Postgres `ILIKE` now; `pg_trgm` index noted for later (no PostGIS yet).

Done when: create → search → view → share-link round trip works locally with seed + new data.

### Phase 3 — Trust: claim / verify / correct

Maps PRD §13–§16, §27–§28.

Concrete outputs:
- Prisma: `Claim(id, locationId, claimantId, status, decidedBy)`, `Correction(id, locationId, type, detail, status, reporterId)`, `Verification(event log)`, `Location.verificationStatus ∈ unverified|community_verified|resident_verified|owner_verified`.
- API: `POST /api/locations/[id]/claim`, `POST /api/admin/claims/[id]/approve|reject` (QUBATORS_ADMIN only), `POST /api/locations/[id]/corrections`, `POST /api/corrections/[id]/confirm`.
- UI: "Is this your business? Claim" button, owner edit form, `/admin/claims` queue (shadcn `Table`), verification badge component, confidence line (owner-verified + recency + confirmation count, no numeric score).

Done when: CUSTOMER claims → ADMIN approves → badge flips to owner-verified; correction reported → confirmed → location updated.

### Phase 4 — Visual + landmark context + file storage

Maps PRD §11–§12.

Concrete outputs:
- `lib/storage.ts`: `putObject(bucket, key, body)` / `getSignedUrl(key)` behind env switch (local MinIO shim vs R2/Supabase later — same call sites).
- Upload route: `POST /api/uploads` (auth required, file-type/size limits, returns key/url), wired to `LocationPhoto.url`.
- UI: photo uploader with tag selector, "Look for" gallery, landmark multi-select + free-text (mast, filling station, church, school, pharmacy, tree, billboard, market, security post).
- Buckets used now: `reference-photos/`, `avatars/`; `design-attachments/`, `progress-photos/`, `portfolios/` created but empty (no UI — flagged scope gap).

Done when: photo uploaded locally appears on Location Profile under correct tag.

### Phase 5 — Live conditions + email

Maps PRD §17–§20. Email via Resend.

Concrete outputs:
- Prisma: `Alert(id, locationId?, roadHint, type, detail, reportedAt, expiresAt, status, reporterId)` with `type ∈ construction|checkpoint|congestion|closure|accident|flood|event|diversion`.
- API: `POST /api/alerts`, `POST /api/alerts/[id]/confirm` (still happening), `POST /api/alerts/[id]/clear`, cron/expiry job marking expired.
- UI: alert composer, alert card ("Reported 12m ago — Still happening / Cleared"), temporary notice banner on location ("Use Gate B today").
- `lib/email.ts` + Resend templates: claim-approved, correction-decided, alert-expiring (console-log fallback when no API key).

Done when: report → confirm → clear → expire lifecycle works; emails logged/sent in dev.

### Phase 6 — Complex hierarchies + payments scaffold

Maps PRD §29–§31. Payments per stack request (no maps use case — scaffold only).

Concrete outputs:
- Hierarchy: `Location.parentId` self-relation + `level ∈ estate|block|building|floor|unit|shop`; `app/locations/[id]/tree/page.tsx` drill-down (Estate → Gate → Block → Unit; Building → Floor → Unit; shop-in-mall).
- `lib/payments.ts`: `PaymentProvider` interface (`createCharge`, `verifyWebhook`, `createInstallmentPlan`, `getPaymentStatus`); `lib/payments/paystack.ts` implements with Paystack test keys; `POST /api/webhooks/paystack` verifies signature and writes `Payment(status)`.
- Prisma: `Order(id, payerId, amountKobo, currency, status)`, `Payment(id, orderId, provider, reference, status, rawPayload)`, `InstallmentPlan(id, orderId, scheduleJson, status)`.
- No checkout UI in this phase (flagged — needs monetization decision per PRD §38).

Done when: hierarchy drill-down navigates 3+ levels; Paystack webhook test event flips a stub `Payment` row without touching order logic.

### Phase 7 — Hardening + metrics (still local)

Maps PRD §26, §32, §39.

Concrete outputs:
- Privacy: `Location.visibility ∈ public|private_link|approved`; private residences render "Private residence — via shared link" to non-authorized viewers.
- Moderation queue: `/admin/reports` for photos/alerts abuse.
- Metrics log: `ArrivalReport(locationId, helpful: boolean)`, plus counts (shares, creations, verifications, correction rate) queryable via `/admin/metrics` page.
- `npm run build` + `npx tsc --noEmit` + `npx prisma validate` green on localhost. No deploy step.

## 3. Steering Notes

- **Question asked (2026-09-27):** Why PostgreSQL over simpler local SQLite when only a single local page is needed right now? Should we keep PostgreSQL or switch?
- **What was explained:** SQLite is zero-setup/file-based and fastest to a single working page; Prisma supports it, and Auth.js flows work for basic cases. PostgreSQL costs more setup (Docker) but matches the stated prod targets (Neon/Supabase), handles concurrent community writes without `SQLITE_BUSY` pain, supports `pg_trgm`/full-text and later PostGIS geo queries the maps search (§21) will need, has mature Auth.js adapter behavior, and gives transactional integrity for future Paystack orders/installments. Starting on SQLite means a later Prisma migration rewrite the moment any Postgres-specific feature is needed.
- **Decision:** Keep PostgreSQL.
- **Why:** User confirmed "Keep PostgreSQL" after tradeoff walkthrough. Local Postgres via Docker preserves prod parity (Neon/Supabase), avoids a mid-project SQLite→Postgres migration, and covers concurrent edits, verification/claims queues, alerts, and payment tables the plan already scaffolds. Accepted cost: Docker setup for local dev instead of zero-config SQLite.

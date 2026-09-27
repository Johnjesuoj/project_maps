# Implementation Plan — Project Maps

Source of truth: `Product Requirements Document — Detailed Location & Navigation Platform.md` (PRD v1)

North Star (PRD §40): **Can a person who has never been to this place find it without having to call someone for directions?**

Core loop (PRD §33): **Discover → Describe → Navigate → Verify → Share**

Architecture concept (PRD §42): **PLACE + PEOPLE + DIRECTIONS + CONDITIONS**

## Phase 0 — Foundation

Goal: runnable skeleton, decisions locked.

Concrete outputs:
- Mobile-first app scaffold + base map SDK integration (complement existing maps, not replace — PRD §5)
- Auth + user roles: Visitor / Resident / Business Owner / Property Manager / Community Contributor (PRD §28)
- Data model v0:
  - `users(id, role, display_name)`
  - `locations(id, name, category, address)` (extended in Phase 1)
  - Placeholder tables for directions / conditions
- Privacy defaults: Public / private-link / approved-people (PRD §32)
- CI, staging build, analytics events skeleton for success metrics (PRD §39)

Done when: login → blank map → create placeholder location works end-to-end.

## Phase 1 — Core Loop: Discover → Describe → Navigate → Share

PRD §7, §8, §9, §10, §22, §23, §24, §25, §33

Concrete outputs:
- DB: `locations(id, name, category, address, description, entrance, final_directions, verification_status, updated_at)`
- API:
  - `POST /locations`
  - `GET /locations/:id`
  - `PATCH /locations/:id`
  - `GET /locations/search?q=`
- UI:
  - 4-step create: Identify → Explain how to reach → Add visuals → Confirm (PRD §8.1)
  - Location Profile screen: name, category, address, description, entrance, final directions, verification, last updated (PRD §9)
  - Staged guidance: main road → junction → estate → recognize destination (PRD §10, §25)
  - Stages: Navigate to area → You're nearby → Final approach → Recognize → Arrived
  - Share: WhatsApp / SMS / Messenger / copy link + standardized Location Card (PRD §22, §23, §24)
  - "Send Me Your Location" flow: exact location + final directions + landmark/photo + access note

Done when: User A creates a BUZZ-style location, User B finds via search, navigates to area + final approach, and shares the card.

## Phase 2 — Trust: Claim / Verify / Correct

PRD §13, §14, §15, §16, §27, §28

Concrete outputs:
- Verification state machine: `unverified → community_verified → resident_verified → owner_verified`
- Visible badges: e.g. "✓ Owner verified / Updated 3 days ago" — non-intimidating (PRD §13)
- Claim flow: "Is this your business? Claim this location" + owner maintenance of photos, directions, entrances, contact, temporary notices (PRD §14)
- Roles / permissions hierarchy:
  - Owner / Property Manager (highest)
  - Verified Resident / Business
  - Community Contributor (suggest)
  - Visitor (report) (PRD §15)
- Corrections queue: wrong entrance, directions, photo, moved business, blocked road, demolished building, landmark, restriction (PRD §16). Review-based, no immediate delete.
- Location confidence indicator: verification + recency + community confirmations, evidence-based not numeric score (PRD §27)

Done when: owner claims, edits entrance, community confirms, incorrect edit is reported and resolved.

## Phase 3 — Visual + Landmark Context

PRD §11, §12

Concrete outputs:
- Photo store: `location_photos(id, location_id, tag, url, created_by)`
  - Tags: `turn_here | entrance | building | parking`
- Landmark taxonomy: MTN mast, filling station, church, school, pharmacy, tree, billboard, hotel, bridge, market, security post + free-text
- Natural description support: "the house beside the blue pharmacy"
- Entrance fields: main / alternative / gate number / building identification / floor-unit / security instructions
- UI: "Look for" section with blue gate / white building / sign + tagged photos; "Turn here" junction photos

Done when: profile shows "Look for blue gate + white building" with tagged entrance/building photos.

## Phase 4 — Live Conditions

PRD §17, §18, §19, §20

Concrete outputs:
- DB: `alerts(id, location_id, road_hint, type, detail, reported_at, expires_at, status)`
  - Types: construction, checkpoint, congestion, closure, accident, flood, event, diversion
- Traffic alert experience: what + where + reported X min ago + alternative route + "Still happening / Cleared" (PRD §18)
- Checkpoint notifications as neutral location condition: location + reported time + active reports + "Still present / No longer present" (PRD §19)
- Temporary location instructions: "Main entrance temporarily closed. Use side entrance." / "Use Gate B today." (PRD §20)
- Expiry + confirmation logic to prevent stale reports

Done when: user reports blockage, second user confirms still happening, third marks cleared, entry auto-expires.

## Phase 5 — Complex Hierarchies

PRD §29, §30, §31

Concrete outputs:
- Hierarchical model: `locations(id, parent_id, level, name)`
  - Levels: `estate / block / building / floor / unit / shop`
- Examples supported:
  - ABC Building → Floor 1 → Business A/B; Floor 2 → Apartment 201/202 (PRD §29)
  - Greenview Estate → Main entrance → Security gate → Internal road → Block A → House 1-3 (PRD §30)
  - Shop-in-mall, office-in-hotel, salon-in-complex, vendor-in-market (PRD §31)
- UI: drill-down navigator for compounds / estates / multi-unit buildings

Done when: visitor navigates Estate → Gate → Internal road → Block → Unit without extra call.

## Phase 6 — Discovery + Launch Hardening

PRD §26, §32, §34, §38, §39

Concrete outputs:
- Nearby discovery (secondary until density sufficient): businesses, services, restaurants, offices, events, landmarks (PRD §26)
- Safety / moderation:
  - Residence masking: "Private residence — detailed directions available through shared link."
  - Photo / report abuse queue
- Metrics dashboard (PRD §39):
  - Successful arrivals
  - Location usefulness votes
  - Shares, creations, verifications, correction rate, repeat usage
- Launch gate: 100+ verified locations in 1-2 Lagos test areas, North Star test pass
- Deferred to later: indoor directions, parking/accessibility, contributor reputation / local guides, business discovery / promotions / booking / analytics, delivery / logistics integrations, API/licensing, monetization (PRD §34, §38)

Killer use-case checklist (PRD §35): home visit, delivery, business in building, large estate, temporary road issue, event entrance → parking → security → hall.

## Build Order

0 → 1 → 2 → 3 → 4 → 5 → 6. Each phase shippable and testable independently.

Positioning (PRD §41): Not "a better Google Maps." Instead: **"The map that gets you all the way there." / "From the road to the door."**

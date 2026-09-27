# Project Maps — Detailed Location & Navigation Platform

> **Maps get you close. We get you there.**
> **From the road to the door.**

A community-powered, mobile-first location platform that turns ordinary map pins into detailed, verified destination guides — helping people get from the main road all the way to the correct door.

Primary market: **Nigeria initially**, with potential expansion.

Status: **Concept / PRD v1 — initial docs commit**

## Problem

Traditional maps answer “Where is this street?” but struggle with:

- Which gate / entrance is the right one?
- Which building inside this compound?
- What does the entrance look like?
- Where to turn after the landmark?
- Is the road blocked today?

This is critical where addresses are informal, estates have multiple entrances, businesses operate inside larger buildings, and landmarks matter more than street names.

## What This Product Is

A **human-verified layer** between a traditional map and the real-world destination. Every meaningful destination gets a **Location Profile / Location Passport**:

**Identity + Directions + Visual Recognition + Access + Verification + Live Conditions**

It complements existing mapping services — it does NOT initially replace global road mapping, satellite imagery, or public-transport routing.

Core loop: **Discover → Describe → Navigate → Verify → Share**

## Core Features (per PRD v1)

1. **Location Creation** — Home, Apartment, Business, Office, Estate, Building, Venue, Shop, Landmark. Simple 4-step flow: Identify → Explain how to reach → Add visuals → Confirm.
2. **Location Profiles** — Name, category, address, entrance info, final directions, landmarks, photos, verification status, last updated. Optional: floor/unit, gate number, security instructions, hours, contact, alternative entrance, accessibility.
3. **“How Do I Get There?”** — Staged last-mile guidance: main road → junction → estate → inside → recognize destination.
4. **Visual Guidance** — Photos for “Turn here”, “This is the entrance”, “Look for this building”, “Park here”.
5. **Landmark System** — MTN mast, filling station, church, school, pharmacy, tree, billboard, market, security post, etc. Understands “the house beside the blue pharmacy.”
6. **Verification & Trust** — Unverified → Community Verified → Resident Verified → Owner Verified. Visible, non-intimidating badges.
7. **Claim a Location** — Owners/occupants claim and maintain photos, directions, entrances, contact, temporary notices.
8. **Multi-contributor model** — Owner/Manager > Verified Resident/Business > Community Contributor > Visitor.
9. **Corrections** — Report wrong entrance, directions, photo, moved business, blocked road, demolished building. Review-based.
10. **Traffic & Road Alerts** — Construction, checkpoint, congestion, closure, accident, flood, event, diversion. Temporary, with “Still happening / Cleared” confirmation.
11. **Temporary Instructions** — e.g. “Main entrance closed today, use side entrance. Use Gate B today.”
12. **Search** — Business names, addresses, landmarks, estates + natural descriptions: “that pharmacy beside the big church in Ikeja”.
13. **Share Location** — WhatsApp / SMS / Messenger / link. Recipient gets Location Card: location, from main road, look-for, entrance photo, final directions.
14. **Navigation** — Stage 1 Navigate to area → 2 You’re nearby → 3 Final approach → 4 Recognize destination → 5 Arrived. Unique value in stages 3-5.
15. **Complex places** — Multi-unit buildings (floors/units), estates/complexes (blocks/houses), businesses-inside-businesses (shop-in-mall).
16. **Privacy** — Public / private-link / approved-people. Residences default to “Private residence — detailed directions available through shared link.”

## Target Users

- **Visitors / Seekers** — friends, customers, deliveries, interviews, events
- **Property Owners** — maintain property identity
- **Tenants / Residents** — e.g. “pass security post, second left, building beside water tank”
- **Business Owners** — restaurants, salons, offices, clinics, studios, shops, venues
- **Community Contributors** — corrections, landmarks, road updates

## MVP Scope (Phase 1-4)

- [ ] Account creation, search, location creation
- [ ] Location profiles, detailed directions, landmarks, photos
- [ ] Claiming, verification, community corrections
- [ ] Sharing + Location Card
- [ ] Traffic/road alerts + confirmation
- [ ] Basic navigation + temporary access notices

Later: indoor/floor navigation, contributor reputation, business discovery/promotions, delivery/logistics integrations, API.

## North Star

> **“Can a person who has never been to this place find it without having to call someone for directions?”**

If yes consistently, it works.

## Repository Contents

- `Product Requirements Document — Detailed Location & Navigation Platform.md` — full PRD v1 (source of truth)
- `README.md` — this overview

## Getting Started

This repo is currently documentation-only. No code yet.

1. Read the full PRD.
2. See MVP Priority (§43 in PRD): Detailed locations → Trust → Landmarks/photos/entrances → Live info → Complex locations → Business ecosystem.
3. Next steps: UX flows for Create/Search/View/Navigate/Share, data model for Place + People + Directions + Conditions, mobile prototype.

## Positioning

Not “a better Google Maps.” Instead:

**“The map that gets you all the way there.”**

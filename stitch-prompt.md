# Google Stitch Prompts — Project Maps (all screens)

How to use: paste **Part A** first so Stitch locks the look and feel. Then paste each screen prompt from **Part B** one at a time (or one phase at a time). Stitch handles 1–4 related screens per prompt best.

---

## Part A — Master prompt (paste first)

Design a **mobile-first app (iPhone, 390×844, dark mode only)** called **Project Maps**. Tagline: **"From the road to the door."** It is a community-verified location app for Nigeria (starting in Lagos) that gets people from the main road to the exact gate, building and door. It complements normal maps; it does not replace them. Each place has a **Location Profile** with entrance, final directions, landmarks, photos, verification and live conditions.

**Visual style**
- Dark, map-first, modern, calm, trustworthy. Dark map tiles behind translucent panels. Draggable bottom sheets with a grabber handle.
- Background `#060E16`. Cards/sheets `#1A2127`, nested panels `#232B32`, raised panels `#2C363D`, borders `#2F3A41`.
- Primary action colour **teal `#2AFFD8`** (buttons, active states, verified badges, map markers). Text on teal is near-black `#04201B`. Primary buttons are full-pill with a subtle teal-to-cyan gradient and soft teal glow.
- **Red `#FF0044` is reserved for urgent things only** (road closed, emergency, report abuse).
- Amber `#F2B705` for temporary notices. Neutral grey `#4E4E57` for disabled/inactive.
- Text: off-white `#E0D8D8`, headings white or mint `#D8EBE4`, secondary text `#8A969C`.
- Font: **Inter Tight** (Light 300 to Bold 700). Small uppercase section labels in a monospace font with wide letter spacing.
- Corner radius: 16px cards, 24px sheets, pill buttons. Circular 44px icon buttons on map corners (map layers top-left, settings top-right, recenter bottom-right).
- Map markers: circular avatars/icons with a 3px teal ring and soft halo; destination marker is a teal pin; alerts are red circles.
- Icons: thin line icons (1.8px stroke), consistent set.
- Large tap targets (min 44px), high contrast, short copy, plain English, Nigerian place examples (Ikeja, Lekki, Yaba, Surulere, Victoria Island, Allen Avenue).
- Verification badges are small pills: Unverified (grey), Community verified (cyan), Resident verified (teal), Owner verified (teal with check). Always show "Updated 3 days ago" next to them. Keep badges friendly, not intimidating.
- Navigation: no tab bar clutter. Main screen is the map with a search bar on top and a bottom sheet. Secondary screens use a back arrow and centred title.

**Sample content to reuse across screens**
- Place: **BUZZ Creative Studio**, 14 Example Street, Ikeja, Lagos. How to find us: "Enter through the second gate after the pharmacy." Final approach: "Once you enter the estate, continue straight for about 100 m. Turn left after the large mango tree. We're the second building on the right." Look for: blue gate, white two-storey building, BUZZ sign. Verified by: business owner + 3 residents.
- Second place: **Oje's Studio** (resident verified). Estate: **Greenview Estate**, Lekki.
- Users: Oje (resident), Amaka (business owner), Tunde (visitor).

---

## Part B — Screen prompts

### Phase 0 — Foundation

**B0.1 Onboarding (3 slides)**
Three onboarding screens with a large illustration area (abstract dark map with glowing teal route ending at a door), big light-weight headline, one-line subtext, progress dots, teal "Continue" pill and a "Skip" text link.
1. "Maps get you close. We get you there."
2. "Real directions from real people." (people adding landmarks and photos)
3. "Know before you go." (live road and access conditions)

**B0.2 Sign up / Log in**
Phone-number-first sign up. Country selector with Nigeria (+234) default, large phone input, teal "Send code" button, small "Continue with Google" secondary pill, terms link. Second screen: 6-box OTP code entry, resend timer, teal "Verify" button. Third screen: set display name and optional profile photo.

**B0.3 Choose your role**
"How will you use Project Maps?" Selectable cards (single choice, teal border when selected): Visitor, Resident, Business owner, Property manager, Community contributor. Each card has an icon, a one-line description and what you can do. Teal "Continue" button. Note: "You can change this later."

**B0.4 Home map (empty state)**
Full-screen dark map of Lagos. Top: search bar "Where are you going?" with a mic icon. Corner icon buttons for layers, settings and recenter. Bottom sheet titled "Nearby" with an empty state illustration, text "No locations yet. Be the first to add one near you." and a teal "Create a location" button.

**B0.5 Settings**
Profile header (avatar, name with edit icon, role pill). A teal-tinted banner "Upgrade your role". Rows with chevrons: Permissions, Privacy defaults, Notifications, Units (Metric), FAQ, Rate us, Feedback, Sign out. Toggle row "Share live battery" is not needed; instead use "Share my approximate area for alerts".

**B0.6 Permissions**
Cards for Location (while using app), Camera (for entrance photos), Photos, Notifications (road alerts). Each has an icon, why we need it, and a status pill (Allowed / Not allowed) with a teal "Allow" button.

**B0.7 Privacy defaults**
"Who can see new locations by default?" Three radio cards: Public, Private link only, Approved people only. Each explains in one line. Info note about residences: "Private residence — detailed directions available through shared link."

---

### Phase 1 — Core loop: Discover, Describe, Navigate, Share

**B1.1 Home map with search results**
Same home map. Search field is focused, showing a keyboard-friendly list under it: recent searches, then results with place icon, name, category, distance and a verification badge. Support natural-language queries like "pharmacy beside the big church in Ikeja", shown with a small "Understood as: Pharmacy · near church · Ikeja" chip above results.

**B1.2 Search results map + list**
Map with teal pins and a draggable bottom sheet listing results as cards (name, category, address, badge, "Updated 3 days ago", small thumbnail of the entrance). Filter chips on top: All, Homes, Businesses, Estates, Landmarks.

**B1.3 Create location — Step 1: Identify the place**
Progress bar "Step 1 of 4". Category grid (Home, Apartment, Business, Office, Estate, Building, Venue, Shop, Landmark, Other). Name field, address field, and a small map with a draggable teal pin plus "Use my current location" link. Teal "Next" button.

**B1.4 Create location — Step 2: Explain how to reach it**
Step 2 of 4. Three large text areas with helper text: "How to find us" (e.g. Enter through the second gate after the pharmacy), "Final approach" (turn-by-turn from the main road), "Entrance". A "Add a step" button to build staged directions (From the main road, At the first junction, At the estate, Inside the estate, Destination). Teal "Next".

**B1.5 Create location — Step 3: Add visual references**
Step 3 of 4. Grid of photo slots with tags: Turn here, Entrance, Building, Parking. Each slot has camera/gallery icons and an optional caption. Quick chips for "Look for": Blue gate, White building, Sign. Teal "Next".

**B1.6 Create location — Step 4: Confirm**
Step 4 of 4. Preview of the finished Location Profile, privacy selector (Public / Private link / Approved people) and a checkbox "I live here or I'm allowed to describe this place". Teal "Publish location" button and a ghost "Save draft".

**B1.7 Location Profile**
Hero photo carousel with the entrance photo. Name "BUZZ Creative Studio", category, address, verification badge row ("✓ Owner verified · Updated 3 days ago"). Sticky actions: teal "Navigate", ghost "Share". Sections with monospace labels: HOW TO FIND US, FINAL APPROACH (numbered staged steps), LOOK FOR (chips plus photos), ENTRANCE, CURRENT CONDITIONS (green "Main entrance open"), VERIFIED BY (avatars and roles). Footer links: "Report a problem", "Is this your business? Claim it".

**B1.8 Navigation stage 1 and 2: To area and Nearby**
Map with a teal route line to the destination pin. Top card shows the current instruction. Stage stepper with 5 segments: To area, Nearby, Final approach, Recognise, Arrived (current segment glows teal). Bottom sheet: ETA, distance, "Open in Google Maps" secondary button for the area route. Second state: "You're nearby" banner with a teal pulse, switching to final-approach guidance.

**B1.9 Navigation stage 3: Final approach**
Map zoomed in. Large instruction card: "Pass the security post and keep straight for about 100 m." Next step preview underneath. Photo strip of the upcoming "Turn here" junction. Stage stepper on top. "Can't find it?" ghost button that calls or messages the contact.

**B1.10 Navigation stage 4: Recognise destination**
Full-width photo of the building with a teal outline label "Look for the white building with the blue gate". Checklist chips (Blue gate, White building, BUZZ sign) the user can tick. Two buttons: teal "This is it" and ghost "Not sure".

**B1.11 Navigation stage 5: Arrived**
Celebration state with a teal check ring. "You've arrived." Prompt: "Did these directions help?" with Yes / Partly / No pills, and a field for "Anything to fix?". Teal "Done".

**B1.12 Share sheet**
Bottom sheet over the profile. A preview of the standardised Location Card on top, then share targets: WhatsApp, SMS, Messenger, Copy link, More. Toggle "Include private entrance details".

**B1.13 Location Card (what the recipient sees)**
Shareable card: small hero photo, name, "Lagos, Nigeria", HOW TO FIND ME, LOOK FOR chips, CURRENT ACCESS (🟢 Main entrance open), VERIFIED badge, big teal "Navigate" button. Should look good as a link preview and as a web page on mobile.

**B1.14 "Send me your location" flow (3 screens)**
1. "Where are you?" map with draggable pin and "Use exact location".
2. "How should I find you?" text area plus "What should I look for?" photo/landmark picker and "Anything I should know?" access note.
3. Final preview of the card with teal "Send via WhatsApp" and a "Copy link" secondary button.

---

### Phase 2 — Trust: Claim, Verify, Correct

**B2.1 Verification levels explainer**
Four stacked cards showing the ladder: Unverified, Community verified, Resident verified, Owner verified, each with badge, one-line meaning and how to reach it. A highlighted "You are here" marker for the current place.

**B2.2 Location confidence panel**
On the profile, expandable panel "Location confidence: High" showing evidence rows, not a numeric score: ✓ Owner verified, ✓ Updated 3 days ago, ✓ 14 community confirmations, ⚠ 1 open correction.

**B2.3 Confirm or report (visitor)**
After arrival or from the profile: "Is this information still correct?" Teal "Yes, it's correct" and ghost "Something's wrong". Choosing the second opens the correction picker (B2.5).

**B2.4 Claim a location (3 screens)**
1. Banner "Is this your business? Claim this location" and a role selector (Owner, Tenant/Resident, Property manager).
2. Proof step: phone/OTP verification, optional document or photo upload, short explanation of review time.
3. Success/pending state: "Claim submitted" with a status timeline and what you can edit once approved (photos, directions, entrances, contact, temporary notices).

**B2.5 Report a problem / correction picker**
List with icons: Wrong entrance, Wrong directions, Incorrect photo, Business moved, Road blocked, Building demolished, Incorrect landmark, Access restriction. Next screen: details, optional photo, "Suggest the right information", teal "Submit". Note: "Corrections are reviewed, nothing is deleted immediately."

**B2.6 Corrections queue (owner/manager)**
Tabs: Open, Resolved. Cards with reporter role, correction type, before/after text, photo, and buttons Accept (teal), Reject (ghost), Ask for details. Small contributor avatar and "reported 2 hours ago".

**B2.7 Contributors and permissions**
Hierarchy list: Owner / Property manager, Verified resident or business, Community contributor, Visitor. Rows with avatar, role pill and a "Manage" menu. Teal "Invite contributor" button. Short permissions summary under each role.

---

### Phase 3 — Visual and landmark context

**B3.1 Photo manager**
Grid of photos grouped by tag tabs: Turn here, Entrance, Building, Parking. Add button tile, drag to reorder, tap for caption editor, and a "Pin on map" action to attach the photo to a spot.

**B3.2 "Turn here" junction guide**
Swipeable photo cards, each with a step number, large photo, teal arrow overlay (left, right, straight) and caption, e.g. "Keep left after the filling station".

**B3.3 Landmark picker**
Searchable grid of landmark types with icons: MTN mast, Filling station, Church, School, Pharmacy, Large tree, Billboard, Hotel, Bridge, Market, Security post, plus "Other (describe it)". Then a form: "Describe it" free text (e.g. "the house beside the blue pharmacy") and a distance/direction selector.

**B3.4 Entrance details editor**
Form sections: Main entrance, Alternative entrance, Gate number, Building identification, Floor/unit, Security instructions. Each has a text field and an optional photo. Toggle "Show security instructions only to approved people".

**B3.5 Look-for section (profile detail)**
Expanded view of LOOK FOR with large tagged photos and chips (Blue gate, White building, BUZZ sign), plus "Add what you see" button for contributors.

---

### Phase 4 — Live conditions

**B4.1 Report road condition**
Bottom sheet over the map: "What's happening?" 4×2 grid of icon tiles: Construction, Checkpoint, Congestion, Closure, Accident, Flood, Event, Diversion. Next step: add short detail, optional photo, location is auto-pinned, teal "Post alert".

**B4.2 Alert detail**
Card over the map for "Road partially blocked": icon, title, detail, "Reported 12 minutes ago", confirmation count, "Alternative route available" link. Buttons: teal "Still happening", ghost "Cleared". Show expiry text "Auto-removes in 40 min unless confirmed".

**B4.3 Checkpoint notification (neutral tone)**
Informational card: "Reported checkpoint", Location: XYZ Road, Reported: 8 minutes ago, Status: Active reports. Buttons "Still present" and "No longer present". Neutral wording, no advice to avoid anyone.

**B4.4 Route with alerts**
Navigation map showing a banner "2 conditions on your route" with small alert pins on the route. Tapping opens a list of alerts with time-ago and an "Use alternative route" button.

**B4.5 Temporary access notice (owner)**
Composer: type selector (Entrance closed, Road inaccessible, Use another gate, Event today), text field (e.g. "Use Gate B today. Gate A is closed."), start/end time, preview of how it appears on the profile (amber banner). Teal "Publish notice".

**B4.6 Alerts feed**
List of recent alerts nearby with filters (All, My routes, Saved places), each with icon, title, time-ago, status pill (Active / Cleared / Expired).

---

### Phase 5 — Complex hierarchies

**B5.1 Estate profile with drill-down**
Greenview Estate header with badge. Vertical path visual: Main entrance → Security gate → Internal road → Block A → Block B. Tap a node to open its children (House 1, 2, 3...). Search within estate field.

**B5.2 Multi-unit building**
ABC Building header. Expandable floors: Floor 1 (Business A, Business B), Floor 2 (Apartment 201, 202), Floor 3 (Office C). Each unit row shows name, type icon and badge. "Add a unit" button.

**B5.3 Unit detail**
Profile screen for Apartment 201: parent breadcrumb (Greenview Estate › Block A › Building 2 › Floor 2), directions from the building entrance ("Take the stairs on the left, door is opposite the lift"), photos, contact.

**B5.4 Navigate inside an estate**
Guided steps stepper: Estate → Gate → Internal road → Block → Unit, with a photo and instruction for each step, progress indicator, and "I'm here" next button.

**B5.5 Add child location**
Form: parent selector, level (Estate, Block, Building, Floor, Unit, Shop), name, short directions from parent, photos.

---

### Phase 6 — Discovery and launch hardening

**B6.1 Nearby discovery**
Tabbed list under the map (Businesses, Services, Restaurants, Offices, Events, Landmarks) with cards: thumbnail, name, distance, badge and an open/closed pill. Keep discovery secondary to the search bar.

**B6.2 Private residence view**
Masked profile: lock icon, "Private residence", text "Detailed directions available through shared link." Teal "Request access" and ghost "I have a link" buttons.

**B6.3 Report abuse**
Sheet with reasons (Fake location, Unsafe or private home exposed, Offensive photo, Harassment, Spam). Optional note, red "Submit report" button, confirmation text.

**B6.4 Moderation queue (admin)**
Table-like cards with reported item (photo or text), reason, reporter, status, and actions Remove, Keep, Warn user.

**B6.5 Metrics dashboard (admin)**
Cards with big numbers and small teal sparklines: Successful arrivals, Usefulness votes, Shares, Locations created, Verified locations, Correction rate, Repeat usage. A progress tile "Launch gate: 100 verified locations in 2 Lagos test areas" at 64%.

**B6.6 Empty, error and offline states**
Three small screens: No results (with "Create this place" button), No connection (cached directions available), Location permission denied.

---

## Part C — Optional follow-up prompts for Stitch

- "Apply a consistent bottom sheet component across all screens and make sure every screen uses the same teal pill button, 16px card radius, and Inter Tight."
- "Create a desktop-width web version of the Location Card (B1.13) for people who open the shared link without the app."
- "Generate light-mode variants only for the Location Card page, keeping teal as the accent."

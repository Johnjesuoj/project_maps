# S-Maps — Play Store submission checklist

App: **Project Maps (S-Maps)** · package `com.johnjesuoj.smaps` · v1.0.0 (code 1)
Built from: Trusted Web Activity (TWA) wrapping https://s-maps.netlify.app

## What's already done (in this repo)
- [x] Release keystore generated (`android/smaps-release.keystore`) — **back it up**
- [x] `twa-manifest.json` — package id, Nocturne colors, portrait, signing key
- [x] `/.well-known/assetlinks.json` served with the keystore's SHA-256 fingerprint
- [x] PWA installability: manifest, icons, service worker (offline shell)
- [x] AAB + APK produced under `android/app-release-bundle.aab` / `app-release-signed.apk`

## You must do in the Play Console (one-time)
1. **Create a developer account** — $25 one-time fee at https://play.google.com/console
   (identity verification now required: name, address, phone.)
2. **Create the app** → name "Project Maps", default language English, free, app.
3. **Upload the AAB** (`android/app-release-bundle.aab`) to a *closed testing* track first.
4. **Complete the Data safety form** — declare:
   - Location (approximate + precise) — collected, not shared, encrypted in transit.
   - Photos/videos (user-uploaded landmark photos).
   - App interactions (abuse reports).
   Justify each against the find-the-door feature.
5. **Store listing** — title, short description (80 chars), full description (4000),
   feature graphic 1024×500, at least 2 phone screenshots (upload from a real device/emulator).
6. **Content rating questionnaire** — likely "Everyone" or "Teen"; TWA targets general audience.
7. **Target audience** — select 18+ (TWA / Play for Families has extra restrictions under 13).
8. **Category** — Maps & Navigation.
9. **Privacy policy URL** — required; must be a live https page describing location + photo handling.

## Before production release
- [ ] Test the closed-testing build on a real Android device (install, offline, fullscreen).
- [ ] Verify asset-links: open the app — no URL bar means verification passed.
- [ ] Bump `appVersionCode` for every upload (Play rejects same-code resubmits).

## Notes / honest limits
- The TWA needs the live site up for first paint; the service worker gives offline shell
  afterward. Deep offline (full map tiles) is capped at ~300 tiles by design.
- Play Console UI changes often — field names above may differ slightly.
- Signing key loss is permanent: without `smaps-release.keystore` you cannot update this listing.

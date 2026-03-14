# BoatBouncer Frontend — Bug Fix Report

## Summary
7 bugs fixed across 9 files. All fixes align the frontend with the fixed backend (boatbouncer-backend-fixed).

---

## Bug Table

| # | ID | File(s) | Description | Root Cause | Fix |
|---|-----|---------|-------------|-----------|-----|
| 1 | FE-01 | `lib/utils.ts` | `poster()` and `authPoster()` produced malformed URLs | When `NEXT_PUBLIC_API_URL` has no trailing slash and path has no leading slash, template literal produced `http://host/apipath` instead of `http://host/api/path` | Added slash-normalization guard inside both functions |
| 2 | FE-02 | `components/booking/lists.tsx` | Review booking API URL missing `/` between `booking` and `${id}` | String interpolation `` `/reviews/booking${id}` `` without separator | Changed to `` `/reviews/booking/${id}` `` |
| 3 | FE-03 | `components/booking/form.tsx` | Hardcoded `"Per_Day"` string instead of `PER_TYPES.PER_DAY` constant (×2 occurrences) | Magic string inconsistency — other comparisons already used the constant | Replaced both with `PER_TYPES.PER_DAY` |
| 4 | FE-04 | `lib/utils.ts` | `objectDiff()` silently skipped properties whose current or new value was falsy (0, "", false) | Guard `if (!(obj2?.[key] && obj1?.[key]))` treated `0` / `""` / `false` as absent | Changed to `if (obj2?.[key] === undefined && obj1?.[key] === undefined)` — only skip truly absent keys |
| 5 | FE-05 | `components/shared/profileUploadDialog/index.tsx`, `components/reviews/index.tsx` | `session?.id` was `undefined` — profile picture upload & review author ID always empty | NextAuth JWT/session spreads the MongoDB `_id` field from the user object but not `id`; the custom session type defines `id` but it is never populated by `{ ...token, ...user }` | Changed `session?.id` → `session?._id` in both files |
| 6 | FE-06 | `pages/user/password/index.tsx` | `recaptcha.clear()` was called synchronously right after `recaptcha.render()`, clearing the widget before it mounted | `render()` is async (returns a Promise) but `clear()` was called in the same tick without awaiting | Removed the premature `recaptcha.clear()` call |
| 7 | FE-07 | `components/booking/lists.tsx`, `components/listing/display.tsx`, `components/searchResults/index.tsx`, `pages/favorites/index.tsx` | "Captained" badge always showed as false / un-captained | Frontend derived `captained` from `boat.features.includes("Captained")` but the backend model stores it as a dedicated `Boolean` field `captained`, not inside the features array | Changed all four call sites to use `boat.captained` / `boat.boatId.captained` directly |

---

## Backend Compatibility Notes

| Frontend usage | Backend route / field | Status |
|---|---|---|
| `isRenter=true` query param | `GET /booking?isRenter=true` (Backend Fix #2) | ✅ aligned |
| `PUT /user/updateProfilePicture/:userId` | Backend Fix #6 (route ordering) | ✅ aligned |
| `GET /review/user/my-reviews` | Backend Fix #5 (route ordering) | ✅ aligned |
| Booking status `"Cancelled" / "Completed"` | Backend `bookingStatus.CANCELLED = 'Cancelled'` | ✅ aligned |
| Offer status `"Processing"` | Backend `offerStatus.PROCESSING = 'Processing'` | ✅ aligned |
| `listingType: "rental" / "activity"` | Backend `LISTING_TYPE.RENTAL / ACTIVITY` | ✅ aligned |

---

## Setup

```bash
cp .env.example .env.local
# fill in all values
npm install
npm run dev
```

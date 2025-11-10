# Developer Notes — Lifestyle Pass

_Last updated: {{today’s date}}_

## 🧱 Current Project State

### Backend (Laravel)
- ✅ Laravel installed and running via `php artisan serve`
- ✅ Database connected (MySQL)
- ✅ `/api/signup` and `/api/login` working
- ✅ Token authentication (Sanctum) functional
- ✅ `/api/venues` endpoint returning data (temporarily public for easier testing)
- ✅ `Venue` model and migration created
- ✅ Test data inserted via `php artisan tinker`

### Frontend (React Native + Expo)
- ✅ Expo app created (`mobile` folder)
- ✅ Using new Expo Router (`app/(tabs)/index.tsx`)
- ✅ Connected to backend `/api/venues` endpoint
- ✅ Venue list displays correctly in app (or web view)
- 🟡 Next step: handle CORS properly (if testing on browser)
- 🟡 Next step: add login + token storage (connect `/api/login`)

---

## 🧭 Next Steps (suggested order)

1. **Frontend:** Add Login Screen
   - Build a form that sends credentials to `/api/login`
   - Save token with `AsyncStorage` (or context)
   - Show venues only after login

2. **Backend:** Add `/api/checkins`
   - Create `Checkin` model + migration
   - Define relationship to `User` and `Venue`
   - Allow POSTing a check-in via API

3. **Frontend:** Add “Check-in” button per venue
   - Send POST to `/api/checkins` using stored token
   - Confirm visually in the UI

4. **Backend:** Add `/api/payouts` (later)
   - For venue reports & analytics

---

## 🧠 Notes to Self
- If `/api/venues` gives 401 again, check if route uses `auth:sanctum`.
- If Expo web shows “CORS” error, enable CORS in Laravel middleware.
- Keep `.env` out of GitHub (`.gitignore` handles this).
- Document each new API route in README as they’re added.

---

## 🏁 Vision Snapshot
A mobile-first app where users:
- Sign up and manage their membership  
- View partner venues  
- Check in via QR codes  
- Venues and admins view reports via dashboard (future)

---

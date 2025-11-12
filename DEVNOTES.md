# Developer Notes — Lifestyle Pass

_Last updated: November 2025_

## ✅ Current Progress

### Backend (Laravel API)

- Laravel project under `/backend`
- Connected to local MySQL (via Workbench)
- Sanctum configured for token-based auth
- Models & tables:
  - `User`
  - `Venue`
  - `Checkin`
- Endpoints:
  - `POST /api/signup` — register a new user
  - `POST /api/login` — login, returns `{ user, token }`
  - `GET /api/me` — current authenticated user (requires Bearer token)
  - `GET /api/venues` — list all venues (currently public)
  - `POST /api/checkins` — create a check-in for the logged-in user
  - `GET /api/my-checkins` — list check-ins for the logged-in user (with venue info)

### Frontend (React Native + Expo)

- Expo app under `/mobile`
- Using Expo Router with tabs:
  - `(tabs)/index.tsx` → Venues list, login status, check-in button, logout
  - `(tabs)/history.tsx` → “My Check-ins” list
  - `login.tsx` → login screen
- API base URL for local dev:
  - `http://127.0.0.1:8000/api`
- Auth handling:
  - Login screen (`login.tsx`) sends credentials to `/api/login`
  - On success, saves token to AsyncStorage via `utils/auth.ts`
  - Venues tab:
    - Loads token from AsyncStorage
    - Calls `/me` to show “Logged in as …”
    - Uses token for `/checkins`
  - History tab:
    - Loads token from AsyncStorage
    - If no token → shows “Please log in”
    - If token → fetches `/my-checkins` and shows list

### Utility

- `mobile/utils/auth.ts`:
  - `saveToken(token: string)` — store token in AsyncStorage
  - `getToken()` — read token from AsyncStorage
  - `clearToken()` — remove token from storage
- Logout:
  - Venues screen header shows `Logout` when logged in
  - `handleLogout()` calls `clearToken()`, resets state, and routes to `/login`

---

## 🧭 Next Steps

### Short-Term

- Add basic client-side validation on login form  
  - Require non-empty email/password  
  - Show friendlier error messages (not just “Invalid credentials”)  
- Add a simple “Profile” or “Account” screen  
  - Show name, email  
  - Maybe subscription status in the future  
- Improve “My Check-ins”:  
  - Group by date  
  - Limit to recent 10–20 entries, with pagination or “Load more”

### Medium-Term

- Implement subscription/payment via Stripe in backend  
- Add roles:  
  - Member  
  - Venue owner  
  - Admin  
- Create venue dashboard (web or mobile) for:  
  - Viewing check-ins  
  - Payout summaries

### Long-Term

- Deploy Laravel backend to a live server  
- Use a real domain (e.g. `api.lifestylepass.com`)  
- Build production mobile apps:  
  - Android (Play Store)  
  - iOS (TestFlight → App Store)

---

## 🧰 Dev Commands

### Backend

Run dev server:
    php artisan serve

Run all migrations:
    php artisan migrate

Reset DB (dangerous, dev only):
    php artisan migrate:fresh

Example API test from PowerShell:
    Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/venues" `
      -Method GET `
      -Headers @{ "Accept" = "application/json" }

### Frontend

Start Expo (local dev):
    cd mobile
    npm start

Clear cache:
    npm start -- --clear

---

## 🧱 Current Project Structure

lifestylepass/
├── backend/
│   ├── app/
│   ├── routes/api.php
│   ├── database/
│   └── .env
│
├── mobile/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx      # Tabs setup (Venues + History)
│   │   │   ├── index.tsx        # Venues screen (check-in + logout)
│   │   │   └── history.tsx      # My Check-ins screen
│   │   └── login.tsx            # Login screen
│   ├── utils/
│   │   └── auth.ts              # AsyncStorage token helpers
│   ├── package.json
│   └── app.json
│
├── README.md
├── dev_notes.md
└── .gitignore

---

## 🧑‍💻 Working Dev Flow (Summary)

1. Start backend:  
       php artisan serve

2. Start frontend:  
       cd mobile  
       npm start

3. In the app:  
   - Go to **Login**  
   - Use `craig2@example.com` / `secret1234`  
   - Login → token saved → redirected to Venues  
   - Venues tab:  
     - Shows “Logged in as …”  
     - “Check in” buttons send `/checkins`  
   - My Check-ins tab:  
     - Shows your check-in history from `/my-checkins`  
   - Venues tab:  
     - “Logout” clears token and sends you back to Login

# Developer Notes — Lifestyle Pass

_Last updated: November 2025_

## ✅ Current Progress

### Backend (Laravel API)
- **Set up Laravel project** under `/backend`
- Connected to **MySQL** (local via Workbench)
- Installed and configured **Laravel Sanctum** for API authentication
- Implemented endpoints:
  - `POST /api/signup` — user registration
  - `POST /api/login` — user login
  - `GET /api/me` — fetch logged-in user
  - `GET /api/venues` — list venues
  - `POST /api/checkins` — create a new check-in
- Added database tables for:
  - `users`
  - `venues`
  - `checkins`
- Successfully tested API calls from PowerShell and Tinker
- Working example token:  
  `6|NgK47lUpVmypJlYfOviKocKkde7w88E17hTLjPUA0efdf156`
- Verified basic workflow using PowerShell REST requests

### Frontend (React Native + Expo)
- **Initialized mobile app** under `/mobile`
- Using Expo Router for navigation
- Connected to Laravel backend via local dev API:  
  `http://127.0.0.1:8000/api`
- Implemented basic “Venues” screen:
  - Displays user info (`/me`)
  - Lists venues (`/venues`)
  - Allows “Check in” via POST `/checkins`
- Temporarily using **hardcoded token** for dev:
  ```tsx
  const DEV_TOKEN = '6|NgK47lUpVmypJlYfOviKocKkde7w88E17hTLjPUA0efdf156';
+
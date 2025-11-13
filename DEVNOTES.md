# LifestylePass – Dev Notes

## Overview
LifestylePass is a Laravel + Expo React Native project that allows users to:

- Create accounts and log in
- View venues
- Check in at venues
- View check-in history
- View/edit profile
- See upcoming activities
- Navigate using a hamburger menu
- (Temporary) View a "Map Coming Soon" screen
- Automatic city detection (backend ready, frontend in progress)

This file tracks architecture, conventions, endpoints, and current progress.

------------------------------------------------------------

## Backend (Laravel)

### Routes Summary
- POST /api/signup → AuthController@signup
- POST /api/login → AuthController@login
- GET /api/me → AuthController@me  (requires token)
- POST /api/checkins → CheckinController@store (token)
- GET /api/checkins → CheckinController@index (token)
- GET /api/venues → VenueController@index
  - Accepts ?city=CityName
- GET /api/cities → VenueController@cities
- GET /api/activities → ActivityController@index
- GET /api/venues/{venue}/activities → ActivityController@byVenue

### Database Models
- User  
- Venue (id, name, address, type, city, owner_id)
- Checkin (id, user_id, venue_id, created_at)
- Activity (venue_id, title, start_time, end_time, capacity)

### Notes
- All auth uses Laravel Sanctum token auth.
- CORS enabled for Expo development.
- `/api/me` verifies token and returns user info.
- Logging in + signing up both return a token.

------------------------------------------------------------

## Frontend (Expo React Native)

### File Structure (simplified)
- app/
  - (tabs)/index.tsx       → Venues screen (Home)
  - login.tsx              → Login / Signup screen
  - history.tsx            → Check-in history
  - profile.tsx            → Profile view/edit
  - activities.tsx         → Activities list
  - scan.tsx               → QR placeholder
  - map.tsx                → Mobile map screen (temporary: venue list)
  - map.web.tsx            → Web fallback “Map not available”
- utils/auth.ts            → Token storage
- config.ts                → API_BASE_URL

### Token Storage
Uses `@react-native-async-storage/async-storage`:
- saveToken(token)
- getToken()
- clearToken()

### Login / Signup
- Combined into one screen
- Button toggles login ↔ signup
- Signup validates:
  - name not empty
  - password min 8 chars
  - password == confirm
- Works on device + web

### Venues Screen
- Loads venues on mount
- Displays venue cards
- Can trigger a check-in
- Hamburger menu controls navigation
- Shows login/logout in header
- Detects cities (in progress)

### Activities Screen
- Fetches upcoming activities
- Sorted by date
- Linked to venue

### Map Screen
Because react-native-maps does NOT work on Expo Web:
- `map.tsx` (mobile): shows a list of venues + placeholder map message  
- `map.web.tsx` (web): simple explanation screen  

This avoids runtime errors on web.

------------------------------------------------------------

## Current Limitations / Known Issues
- No real map yet (Google Maps requires EAS build native config)
- City filtering UI in progress
- Activities list UI basic
- No push notifications
- No QR scanning yet

------------------------------------------------------------

## Recent Fixes
- Reorganized controllers into App\Http\Controllers\Api\
- Fixed namespace issues causing HTTP 500
- Fixed login “route not found”
- Signup validation issue resolved
- Added QuickSignup test button
- Fixed menu navigation
- Fixed map crash on web by adding map.web.tsx
- Updated Venues UI padding and layout

------------------------------------------------------------

## Next Possible Tasks
1. Add real map (native-only via EAS build)
2. Add device-based nearest venue sorting
3. Improve venue detail screen
4. Add booking system for activities
5. Add user subscriptions / membership plans
6. Add admin dashboard (web)
7. Add QR-code checkin workflow
8. Add favorites / saved venues

------------------------------------------------------------

## Development Commands

### Backend
php artisan serve  
php artisan migrate  
php artisan tinker  

### Frontend (Expo)
npm start  
Press "w" for web  
Scan QR for mobile  

------------------------------------------------------------

## API Testing Snippet (PowerShell)
$signup = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/signup" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json"; "Accept" = "application/json" } `
  -Body '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "secret1234"
  }'

------------------------------------------------------------

## Notes to Developers
- Always check Laravel logs: storage/logs/laravel.log
- When mobile and API can’t connect:  
  - ensure Expo shows correct LAN IP  
  - update API_BASE_URL accordingly  
- Remember: React Native async functions require "await" inside functions marked async

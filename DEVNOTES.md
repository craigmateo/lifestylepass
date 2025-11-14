# Developer Notes – Lifestyle Pass

This document contains ongoing development notes, architecture decisions, and implementation details for both the backend (Laravel) and mobile app (Expo + React Native).

---

# 🧱 OVERVIEW

Lifestyle Pass is a fitness membership platform similar to Urban Sports Club.

Includes:

- Laravel backend (REST API + Sanctum authentication)
- MySQL database
- React Native mobile app (Expo Router)
- Venue browsing & check-ins
- Activities with schedule
- Location filtering
- Basic profile
- Mobile-only map support

---

# 📡 BACKEND (LARAVEL API)

## Folder Structure

backend/
  app/
    Http/
      Controllers/
        Api/
  routes/
    api.php
  database/
    migrations/
    seeders/

## Important Controllers

Api/AuthController.php  
Handles:
- signup
- login
- me (authenticated user info)

Api/VenueController.php  
- list venues
- filter by city
- show venue details
- relationship: venue → activities

ActivityController.php  
- list activities (date range)
- list activities by venue
- simple POST /activities create route (admin use)
- relationship: activity → venue

CheckinController.php  
- create a check-in
- list user check-ins

## Authentication

Using Laravel Sanctum:

Users authenticate via:

POST /api/signup  
POST /api/login

Returns:

token: "X|xxxxxxxxxxxx"

Mobile app stores token in AsyncStorage and passes it as:

Authorization: Bearer TOKEN

## Cities Endpoint

Created dynamic city list from venues:

GET /api/cities  
Returns array of unique city names.

## Activity Seeding

Custom seeder generates 5 days of activities per venue:

database/seeders/ActivitySeeder.php

Run:

php artisan db:seed

---

# 🗃 DATABASE MODELS

User
  id, name, email, password, etc.

Venue
  id, name, address, type, city

Activity
  venue_id, title, description, start_time, end_time, capacity

Checkin
  user_id, venue_id, created_at

Relationships:

Venue -> activities  
User -> checkins  
Venue -> checkins  

---

# 📱 MOBILE APP (EXPO REACT NATIVE)

## Folder Structure

mobile/
  app/
    index.tsx             (venues list)
    login.tsx
    activities.tsx
    venue/[id].tsx        (venue detail & schedule)
    profile.tsx
    history.tsx
    map.tsx               (mobile only)
    map.web.tsx           (fallback for web)

  utils/
    auth.ts (getToken, saveToken, clearToken)

  config.ts
    API_BASE_URL

## Token Storage (AsyncStorage)

utils/auth.ts:

saveToken(token)
getToken()
clearToken()

Used throughout app for authenticated routes.

## Expo Router Navigation

Files in app/ become routes:

/ → venues  
/login → login/signup  
/history → user check-ins  
/profile → user profile  
/venue/[id] → venue details  
/activities → full activity list  
/map → map view (mobile only)

## Map Support

Mobile uses:

react-native-maps

Web fallback:

map.web.tsx  
Shows “map not available on web”.

## Venues Screen Improvements

- Added padding
- Added hamburger menu
- Displays activities and check-ins
- City selector with GPS city detection
- Detects city using expo-location

## Login / Signup Screen

Features:

- Login + Signup mode switching
- Validation (password length, matching confirm)
- Debug Quick Signup Test button
- Autofill optional

## Venue Detail Screen

Features:

- Shows venue info
- Displays activities for selected date
- Date selection bar
- Tied to backend activities endpoint

---

# 🔧 ISSUES & FIXES

## 1. Expo Go Network Request Failed
Fixed by setting:

API_BASE_URL = "http://YOUR_LOCAL_IP:8000/api"

Not localhost.

Ensure Windows firewall allows inbound port 8000.

## 2. Activities returned empty
Fix: Move ActivityController into Api folder and adjust namespace + import in api.php.

## 3. Login route broke
Fix: Correct namespace:

use App\Http\Controllers\Api\AuthController;

## 4. React Native Maps causing web errors
Solution:
- Add map.web.tsx fallback
- Do not import react-native-maps on web

---

# 🚀 CURRENT FEATURES

Backend
- Auth (signup, login, me)
- Venues (list, filter by city, details)
- Activities (date range, by venue)
- Check-ins (create, list)
- Database seeding

Mobile
- Login / Signup
- Venues list with padding + improved UI
- Venue detail page with schedule
- Activity list
- Check-in button
- Hamburger menu
- Profile page
- Check-in history
- Map screen (mobile only)
- City selection + autodetect

---

# 🎯 NEXT STEPS / ROADMAP

- Add favorite venues
- Add class booking (RSVP / capacity)
- Payment integration
- Push notifications
- Offline mode
- Admin dashboard (web)

---

# 📝 DEV WORKFLOW

Backend:

php artisan serve  
php artisan migrate  
php artisan db:seed  
php artisan tinker  

Mobile:

npx expo start  
Update API_BASE_URL  
Scan QR in Expo Go  

---

# ✔ END OF DEV NOTES

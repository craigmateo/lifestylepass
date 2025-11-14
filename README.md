# Lifestyle Pass – Backend + Mobile App

Lifestyle Pass is a fitness membership app inspired by Urban Sports Club.  
It includes a Laravel backend API and an Expo React Native mobile app (iOS, Android, Web).

---

## 📦 Tech Stack

**Backend**
- Laravel 10
- MySQL
- Sanctum API tokens
- Seeders for demo data

**Frontend**
- React Native (Expo)
- expo-router
- AsyncStorage for token storage

---

# 🚀 Getting Started

## 1. Clone the repository

    git clone https://github.com/yourname/lifestylepass.git
    cd lifestylepass

---

# 🖥 Backend Setup (Laravel API)

Go to backend folder:

    cd backend

Install dependencies:

    composer install

Copy environment file:

    cp .env.example .env

Update DB credentials in `.env`  
Then generate app key:

    php artisan key:generate

Run migrations:

    php artisan migrate

Seed demo data:

    php artisan db:seed

Start backend server:

    php artisan serve --host=0.0.0.0 --port=8000

This exposes the API so your Expo Go app can access it over LAN.

---

# 📱 Mobile App Setup (Expo React Native)

Go to mobile folder:

    cd mobile

Install dependencies:

    npm install

Start Expo:

    npx expo start

Open the Expo Go app on your phone and scan the QR code.

---

# 🌐 Configure API URL for Mobile App

Open:

    mobile/config.ts

Set your computer’s LAN IP:

    export const API_BASE_URL = "http://YOUR_LOCAL_IP:8000/api";

Example:

    export const API_BASE_URL = "http://192.168.0.197:8000/api";

❗ Do *not* use localhost — phones cannot reach it.

---

# 🗂 Project Structure

    backend/
        app/
        routes/
        database/
        ...
    mobile/
        app/
            (auth)
            (tabs)
            venue/[id].tsx
            activities.tsx
            map.tsx
        utils/
            auth.ts
        config.ts

---

# 🔐 Auth Overview

- Users authenticate via `/api/login` or `/api/signup`
- Successful login returns a Sanctum token
- Mobile app saves the token using AsyncStorage
- Protected API routes require:

    Authorization: Bearer TOKEN_HERE

---

# 🏋️ Venues & Activities

## Venues example:

    GET /api/venues
    GET /api/venues?city=Berlin

## Activities:

    GET /api/activities
    GET /api/venues/{id}/activities

Seeder generates 5 days of activities per venue.

---

# 🗺 Map Support

- Native map uses `react-native-maps`
- Web fallback uses `map.web.tsx`

Map works in Expo Go (iOS + Android)  
Web shows a placeholder message.

---

# 🧪 Testing API in PowerShell

Signup:

    Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/signup" `
      -Method POST `
      -Headers @{ "Content-Type"="application/json" } `
      -Body '{ "name":"Test", "email":"test@example.com", "password":"secret1234" }'

Login:

    Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" `
      -Method POST `
      -Headers @{ "Content-Type"="application/json" } `
      -Body '{ "email":"test@example.com", "password":"secret1234" }'

---

# 🧹 .gitignore

Laravel + Expo combined:

    /vendor/
    /node_modules/
    /public/storage
    /storage/*.key

    .env
    .env.local
    .env.development
    .env.production

    .DS_Store
    Thumbs.db

    *.log
    *.sqlite
    npm-debug.log
    yarn-error.log

---

# ✔ Seed Demo Data

Run:

    php artisan db:seed

Creates:

- Demo venues
- Demo activities (next 5 days)
- Test user accounts

---

# 🧭 Routing Summary

**Backend routes:**  
Located in `routes/api.php`

**Frontend routes:**  
Via Expo Router inside `mobile/app/`

---

# ✔ Everything Working So Far

- Login / signup
- Token storage
- Venues list
- Check-ins
- Activity list
- Venue detail page with schedule
- Hamburger menu
- Basic profile page
- Map (mobile only)
- Seeders for demo activities
- Expo Go compatibility

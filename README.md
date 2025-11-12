# Lifestyle Pass

Lifestyle Pass is a pilot project for a subscription-based lifestyle and fitness pass.  
Members can log in, browse partner venues, check in via the app, and view their usage history.

This repo contains:

- A **Laravel** backend (`/backend`) exposing a JSON REST API
- A **React Native + Expo** mobile app (`/mobile`) that talks to the API

---

## Features

### Backend (Laravel API)

- User registration and login
- Token-based authentication with Laravel Sanctum
- Venues listing
- Check-ins for logged-in users
- “My Check-ins” endpoint for user history
- `/me` endpoint for profile data

### Mobile App (React Native + Expo)

- Login screen (email + password)
- Venues screen:
  - Shows login status (“Logged in as …”)
  - Lists available venues from the backend
  - Allows the user to **Check in** at a venue
- My Check-ins screen:
  - Shows a list of past check-ins (with venue and timestamp)
  - Handles “not logged in” state gracefully
- Profile screen:
  - Shows name, email, and “member since” date (from `/me`)
  - Placeholder for plan info
- Navigation:
  - No bottom tab bar
  - **Hamburger menu** in the header for navigation between:
    - Venues
    - My Check-ins
    - Profile
    - Login / Logout

---

## Project Structure

lifestylepass/
├── backend/              # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   │   └── api.php
│   └── .env              # local environment (NOT committed)
│
├── mobile/               # React Native + Expo app
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx   # Tabs config (tabs hidden, used for routing only)
│   │   │   ├── index.tsx     # Venues screen (check-ins, logout, menu)
│   │   │   ├── history.tsx   # My Check-ins screen
│   │   │   └── profile.tsx   # Profile screen
│   │   └── login.tsx         # Login screen
│   ├── utils/
│   │   └── auth.ts           # AsyncStorage helpers (save/get/clear token)
│   ├── app.json
│   └── package.json
│
├── dev_notes.md
├── README.md
└── .gitignore

---

## Backend Setup (Laravel)

### 1. Install dependencies

From the `backend` folder:

    cd backend
    composer install

### 2. Environment configuration

Copy the example env file:

    cp .env.example .env

Edit `.env` and set up at least:

- Application key (run `php artisan key:generate`)
- Database credentials

Example (adjust based on your MySQL setup):

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=lifestylepass
    DB_USERNAME=your_mysql_user
    DB_PASSWORD=your_mysql_password

Generate app key:

    php artisan key:generate

### 3. Run migrations

Create database tables:

    php artisan migrate

(Optional) If you have seeders later, you can use:

    php artisan migrate --seed

### 4. Run the backend server

Local dev (PC only):

    php artisan serve

If you want to access the API from a **real phone on the same Wi-Fi**:

    php artisan serve --host 0.0.0.0 --port 8000

You may need to allow PHP through Windows Firewall.

---

## Mobile App Setup (React Native + Expo)

### 1. Install dependencies

From the `mobile` folder:

    cd mobile
    npm install

### 2. Configure API base URL

The mobile app uses a constant called `API_BASE_URL` in multiple files:

- `mobile/app/(tabs)/index.tsx`
- `mobile/app/(tabs)/history.tsx`
- `mobile/app/(tabs)/profile.tsx`
- `mobile/app/login.tsx`

For development, set it to your backend URL:

- If you are running everything on the **same machine** and using **Expo Web**, you can often use:

      const API_BASE_URL = 'http://127.0.0.1:8000/api';

- If you are testing on a **real device (Expo Go)**, use your PC’s LAN IP (found via `ipconfig`):

      const API_BASE_URL = 'http://192.168.x.x:8000/api';

Make sure the value is consistent across all the files above.

### 3. AsyncStorage token helpers

The file `mobile/utils/auth.ts` provides:

- `saveToken(token: string)` — save auth token after login
- `getToken()` — read auth token
- `clearToken()` — log out

These are used in the login, venues, history, and profile screens.

### 4. Run Expo

From the `mobile` folder:

    npm start

This will start the Metro bundler. You can:

- Press `w` to open the app in a web browser, or
- Scan the QR code with the **Expo Go** app on your phone

Make sure:

- Backend is running (`php artisan serve` or with `--host 0.0.0.0`)
- Mobile `API_BASE_URL` matches the backend URL

---

## Usage Flow

### 1. Start services

Backend:

    cd backend
    php artisan serve --host 0.0.0.0 --port 8000

Frontend:

    cd mobile
    npm start

### 2. Create / confirm a test user

You can sign up via the API or app:

#### Via API (PowerShell example)

    Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/signup" `
      -Method POST `
      -Headers @{
        "Content-Type" = "application/json"
        "Accept"       = "application/json"
      } `
      -Body '{
        "name": "Craig App User",
        "email": "craig2@example.com",
        "password": "secret1234"
      }'

Or create/reset in Tinker:

    php artisan tinker

Inside Tinker:

    use App\Models\User;
    use Illuminate\Support\Facades\Hash;

    $user = User::updateOrCreate(
        ['email' => 'craig2@example.com'],
        [
            'name' => 'Craig App User',
            'password' => Hash::make('secret1234'),
        ]
    );

    $user;

### 3. Log in through the app

- Open the Expo app (web or Expo Go)
- Go to **Login**
- Use:

      Email:    craig2@example.com
      Password: secret1234

- On success:
  - Token is saved to AsyncStorage
  - You’re redirected to the Venues screen
  - The header shows “Logged in as …”

### 4. Venues screen

- Shows:
  - App title
  - Hamburger menu (☰) for navigation:
    - Venues
    - My Check-ins
    - Profile
    - Login / Logout
  - Login status (“Logged in as …” or “Not logged in”)
- Shows a list of venues from `/api/venues`
- Each venue card has:
  - Name
  - Address
  - Optional type
  - **Check in** button

When you tap **Check in**:

- The app sends `POST /api/checkins` with your token and venue ID
- On success:
  - You see a success alert
  - A new row is created in the `checkins` table

### 5. My Check-ins screen

- Accessed via the hamburger menu (**My Check-ins**)
- Fetches `GET /api/my-checkins` with your token
- Displays a list of past check-ins:
  - Venue name
  - Address
  - Type
  - Timestamp
- If you are **not logged in**, shows a friendly message:
  - “Please log in to view your check-ins.”

### 6. Profile screen

- Accessed via menu (**Profile**)
- Fetches `GET /api/me` with your token
- Displays:
  - Name
  - Email
  - “Member since” (based on `created_at` if available)
  - Placeholder plan info (“Lifestyle Pass (placeholder)”)
- If not logged in, shows:
  - “Please log in to view your profile.”

### 7. Logout

- On the Venues screen:
  - The header shows a **Logout** button when logged in
  - Tapping it:
    - Calls `clearToken()` (removes token from AsyncStorage)
    - Resets local state
    - Sends you to `/login`
- After logout:
  - Venues shows “Not logged in”
  - My Check-ins and Profile will prompt you to log in

---

## Dev Notes

See `dev_notes.md` for:

- More detailed internal notes
- Roadmap (short-term, medium-term, long-term)
- Common dev commands
- Rough deployment thoughts

---

## Next Ideas

- Add client-side validation to the login screen
- Implement password change / account settings on Profile
- Add Stripe-powered subscription logic to backend
- Build a venue owner dashboard (web-based) for check-in and payout reports
- Deploy backend and use a real HTTPS domain for the API
- Prepare production builds of the mobile app (Android / iOS)

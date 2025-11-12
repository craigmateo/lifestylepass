# LifestylePass – Dev Notes

## 🧱 Project Overview
LifestylePass is a full-stack project using:
- **Backend:** Laravel (PHP)  
- **Frontend:** Expo React Native (TypeScript)  
- **Database:** MySQL (local via Workbench)

The app allows users to:
- Sign up / log in (Laravel Sanctum tokens)
- View venues
- Check in at venues
- View check-in history
- Access a user profile
- Log out

---

## ⚙️ Backend Setup (Laravel)
1. Start backend:  
   cd backend  
   php artisan serve  
   → Serves API at http://127.0.0.1:8000  
   (For mobile devices: use LAN IP, e.g. http://192.168.x.x:8000)

2. Key commands:  
   php artisan migrate  
   php artisan tinker  
   php artisan route:list  

3. Example routes:  
   - POST /api/signup  
   - POST /api/login  
   - GET /api/venues  
   - POST /api/checkins  
   - GET /api/profile  

4. Database: MySQL  
   - Database config in .env  
   - Can view/manage via MySQL Workbench.

---

## 📱 Frontend Setup (Expo / React Native)
1. Start frontend:  
   cd mobile  
   npm start  
   → Opens Expo Dev Tools  
   - Press w for web  
   - Or scan QR with Expo Go

2. Local API base URL:  
   - Defined in mobile/config.ts  
   - For real device: update to your LAN IP  
     Example: export const API_BASE_URL = 'http://192.168.80.1:8000/api';

3. Core screens:  
   - (tabs)/index.tsx → Venues list  
   - (tabs)/history.tsx → My Check-ins  
   - (tabs)/profile.tsx → Profile  
   - login.tsx → Log In / Sign Up  
   - Shared layout includes a hamburger menu

---

## 👥 Authentication Flow
- **Signup/Login:** Communicates with Laravel API.  
- **Token storage:** AsyncStorage via utils/auth.ts  
- **Auto-login:** On app start, stored token is used for authenticated requests.  
- **Logout:** Clears token and redirects to login.

---

## 🆕 Recent Additions (Nov 2025)
✅ **Signup now functional**  
- Uses same fetch logic as Quick Test  
- Returns and stores token (or auto-logins if token missing)  
- Displays validation errors clearly (e.g., email taken)

✅ **Dev-friendly autofill**  
- In dev mode, signup auto-fills fields for quick testing  
- `demo${Date.now()}@example.com` ensures unique emails

✅ **Improved validation**  
- Checks for missing fields, short passwords, mismatched passwords  
- Displays alerts with specific causes

✅ **UI improvements**  
- Added padding/margins to venue cards  
- Switched from tab bar to hamburger menu for better mobile UX

✅ **Profile Page**  
- Displays user info fetched from `/api/profile`  
- Protected route (requires valid token)

---

## 🧪 Testing APIs Manually
**PowerShell Example:**

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/signup" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "name": "Craig Tester",
    "email": "craig@example.com",
    "password": "secret1234"
  }'

---

## 🧰 Development Shortcuts
- Quick signup test button available in Auth screen for dev.  
- Autofill dev accounts with:  
  `const isDev = process.env.NODE_ENV === 'development';`  
- Optional “Use Demo Sign-Up” button for testing user creation.

---

## 🚀 Next Steps
- [ ] Improve error modals (instead of alerts)  
- [ ] Add QR scan screen (`/scan`) for real venue check-ins  
- [ ] Add profile editing  
- [ ] Prepare `.env.production` and deployment config  
- [ ] Create seed data for venues  
- [ ] Hook up real backend hosting (e.g., Forge or Laravel Vapor)

---

## 🗂️ Git Reminders
- `.env` and `node_modules` ignored.  
- Use `.gitignore` that covers:  
  - Laravel defaults  
  - Expo / React Native artifacts  
  - OS + IDE files

---

_Last updated: Nov 2025_

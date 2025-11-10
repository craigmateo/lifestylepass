# Lifestyle Pass

A mobile-first membership system that allows users to sign up, check in at venues, and manage their subscriptions.  
Built with **Laravel (backend)** and **React Native + Expo (frontend)**.

## 🏗️ Tech Stack

| Layer    | Technology           | Purpose                                |
|----------|----------------------|----------------------------------------|
| Backend  | Laravel (PHP)        | API, authentication, business logic    |
| Database | MySQL                | Persistent data store                  |
| Frontend | React Native (Expo)  | Mobile & web client interface          |
| Auth     | Laravel Sanctum      | Token-based authentication             |

## ⚙️ Backend Setup

1. **Navigate to backend folder:**  
    cd backend

2. **Install dependencies:**  
    composer install

3. **Create environment file:**  
    cp .env.example .env

4. **Configure .env:**  
    DB_CONNECTION=mysql  
    DB_HOST=127.0.0.1  
    DB_PORT=3306  
    DB_DATABASE=lifestylepass  
    DB_USERNAME=your_username  
    DB_PASSWORD=your_password

5. **Generate app key & migrate:**  
    php artisan key:generate  
    php artisan migrate

6. **Start server:**  
    php artisan serve  

   The API will run at:  
   http://127.0.0.1:8000

## 📱 Frontend Setup

1. **Navigate to frontend folder:**  
    cd mobile

2. **Install dependencies:**  
    npm install

3. **Start the Expo app:**  
    npm start

4. **Run on web (simplest for local testing):**  
   Press **w** in the terminal.

5. **Run on phone (optional):**  
   - Download the Expo Go app  
   - Scan the QR code shown in the terminal

## 🔌 API Endpoints

| Method | Endpoint     | Description                        |
|--------|--------------|------------------------------------|
| POST   | /api/signup  | Register a new user                |
| POST   | /api/login   | Login and receive token            |
| GET    | /api/me      | Get current authenticated user     |
| GET    | /api/venues  | List all venues (currently public) |

## 🧱 Current Project State

### Backend (Laravel)

- Laravel installed and running via `php artisan serve`
- Database connected (MySQL)
- `/api/signup` and `/api/login` working
- Token authentication (Sanctum) functional
- `/api/venues` endpoint returning data (temporarily public)
- `Venue` model and migration created
- Test data inserted using `php artisan tinker`

### Frontend (React Native + Expo)

- Expo app created in the `mobile` folder
- Using new Expo Router (`app/(tabs)/index.tsx`)
- Connected to backend `/api/venues`
- Venue list displays correctly in app or web
- Next step: handle CORS properly (for web)
- Next step: add login + token storage

## 🧭 Next Steps

1. **Frontend:** Add login screen  
   Build a form that sends credentials to `/api/login` and stores the returned token.

2. **Backend:** Add `/api/checkins`  
   Create a `Checkin` model and migration, and allow users to POST check-ins.

3. **Frontend:** Add "Check-in" button per venue  
   Send POST requests to `/api/checkins` using the stored token.

4. **Backend:** Add `/api/payouts`  
   For venue reports and analytics (future feature).

## 🧠 Notes to Self

- If `/api/venues` returns 401, check whether the route is behind `auth:sanctum`.
- If Expo web shows a CORS error, enable CORS in Laravel middleware.
- Keep `.env` out of GitHub (already in `.gitignore`).
- Update this README whenever new routes or features are added.

## 🏁 Vision Snapshot

A mobile-first app where users:  

- Sign up and manage their membership  
- View partner venues  
- Check in via QR codes  

And where venues/admins (future work) can:  

- View check-in activity  
- See reports and payouts  

## 📚 References

- Laravel Docs: https://laravel.com/docs  
- React Native Docs: https://reactnative.dev/  
- Expo Docs: https://docs.expo.dev/

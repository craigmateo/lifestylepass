# 🏋️ Lifestyle Pass – Backend (Laravel API)

The **Lifestyle Pass** backend provides the REST API, database models, and authentication for the Lifestyle Pass mobile app.  
It is built using **Laravel** and **MySQL**, with optional integration for **Stripe payments** and **QR code check-ins**.

---

## ⚙️ Tech Stack

- **Framework:** Laravel 11 (PHP 8.2+)
- **Database:** MySQL / MariaDB
- **Auth:** Laravel Sanctum (token-based API)
- **Payment (planned):** Stripe
- **Frontend clients:** React Native (mobile), Laravel/React (web)

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repository

    git clone https://github.com/<your-username>/lifestylepass-backend.git
    cd lifestylepass-backend

### 2️⃣ Install dependencies

    composer install

If Composer isn’t installed, see:  
[https://getcomposer.org/download/](https://getcomposer.org/download/)

---

### 3️⃣ Environment setup

Copy the example file and update environment variables:

    cp .env.example .env

Edit `.env` and configure your database connection:

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=lifestyle_pass
    DB_USERNAME=root
    DB_PASSWORD=yourpassword

Generate the application key:

    php artisan key:generate

---

### 4️⃣ Run database migrations

    php artisan migrate

This creates all required tables in your configured database.

---

### 5️⃣ Start the local development server

    php artisan serve

The API will be available at:

👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧪 Testing the API

### Test the base route

    curl http://127.0.0.1:8000/api/test

Expected response:

    {"message": "API is alive"}

---

### Example: User Signup

    curl -X POST http://127.0.0.1:8000/api/signup \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Craig Tester",
        "email": "craig@example.com",
        "password": "secret1234"
      }'

Expected response:

    {
      "user": {
        "id": 1,
        "name": "Craig Tester",
        "email": "craig@example.com"
      }
    }

---

## 🧩 Project Structure

    app/
     ├── Http/
     │   ├── Controllers/Api/AuthController.php
     │   └── Middleware/
     ├── Models/
     │   └── User.php
    bootstrap/
    config/
    database/
     ├── migrations/
    public/
    routes/
     ├── api.php
     └── web.php

---

## 🔐 Next Steps

1. Add **Laravel Sanctum** for API token authentication.  
2. Add models:
   - `Venue`
   - `Subscription`
   - `Checkin`
   - `Payout`  
3. Build `/api/venues` and `/api/checkins` endpoints.  
4. Integrate **Stripe** for membership payments.

---

## 🧰 Development Notes

- All API responses are **JSON**.  
- Avoid committing `.env` or `vendor/` folders.  
- Log files are stored in `storage/logs/laravel.log`.  
- Use MySQL Workbench or phpMyAdmin for DB visualization.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

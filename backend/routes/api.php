<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Venue;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Api\CheckinController;
use App\Http\Controllers\Api\AuthController;
// Cities list
Route::get('/cities', function () {
    return Venue::query()
        ->whereNotNull('city')
        ->distinct()
        ->orderBy('city')
        ->pluck('city');
});

// Venues
Route::get('/venues', [VenueController::class, 'index']);

// Activities
Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/venues/{venue}/activities', [ActivityController::class, 'byVenue']);

// (optional, protected create)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/activities', [ActivityController::class, 'store']);
    Route::get('/my-checkins', [CheckinController::class, 'index']);
});

// Auth
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login',  [AuthController::class, 'login']);

// Venues & cities
Route::get('/cities', function () {
    return Venue::query()
        ->whereNotNull('city')
        ->distinct()
        ->orderBy('city')
        ->pluck('city');
});

Route::get('/venues', [VenueController::class, 'index']);

// Activities (public list)
Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/venues/{venue}/activities', [ActivityController::class, 'byVenue']);

/*
|--------------------------------------------------------------------------
| Authenticated routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Current user info
    Route::get('/me', [AuthController::class, 'me']);

    // Check-ins
    Route::post('/checkins', [CheckinController::class, 'store']);
    Route::get('/my-checkins', [CheckinController::class, 'index']);

    // (Optional) admin create activities via API
    Route::post('/activities', [ActivityController::class, 'store']);
});
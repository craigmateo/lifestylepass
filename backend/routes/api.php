<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\Api\CheckinController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is alive']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Public for now (easy to test)
Route::get('/venues', [VenueController::class, 'index']);

// Protected routes (need Bearer token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::post('/checkins', [CheckinController::class, 'store']);
});


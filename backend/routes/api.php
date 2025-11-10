<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VenueController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is alive']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// TEMP: make venues public so it's easy to test
Route::get('/venues', [VenueController::class, 'index']);

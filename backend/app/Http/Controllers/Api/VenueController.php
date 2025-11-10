<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;

class VenueController extends Controller
{
    public function index()
    {
        return Venue::all();
    }
}

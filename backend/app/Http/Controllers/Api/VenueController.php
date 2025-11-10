<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    public function index()
    {
        return Venue::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'address' => 'required']);
        return Venue::create($request->all());
    }
}

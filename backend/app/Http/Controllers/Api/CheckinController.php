<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use Illuminate\Http\Request;

class CheckinController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['venue_id' => 'required|exists:venues,id']);
        $user = $request->user();
        $checkin = Checkin::create([
            'user_id' => $user->id,
            'venue_id' => $request->venue_id,
            'timestamp' => now(),
        ]);
        return response()->json($checkin, 201);
    }
}

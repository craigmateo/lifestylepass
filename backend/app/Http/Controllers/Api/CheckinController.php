<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checkin;
use Illuminate\Http\Request;

class CheckinController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'venue_id' => 'required|exists:venues,id',
        ]);

        $checkin = Checkin::create([
            'user_id'  => $user->id,
            'venue_id' => $validated['venue_id'],
            'timestamp'=> now(),
        ]);

        return response()->json($checkin, 201);
    }

    public function myCheckins(Request $request)
    {
        $user = $request->user();

        $checkins = Checkin::with('venue')
            ->where('user_id', $user->id)
            ->orderBy('timestamp', 'desc')
            ->get();

        return response()->json($checkins);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Venue;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        return Activity::with('venue:id,name,address,city')
            ->orderBy('start_time')
            ->get();
    }

    public function byVenue(Venue $venue)
    {
        $items = $venue->activities()
            ->orderBy('start_time')
            ->where('start_time', '>=', now()->startOfDay())
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id'    => ['required','exists:venues,id'],
            'title'       => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'start_time'  => ['required','date'],
            'end_time'    => ['nullable','date','after_or_equal:start_time'],
            'capacity'    => ['nullable','integer','min:1'],
        ]);

        $activity = Activity::create($data);

        return response()->json($activity->load('venue:id,name,address,city'), 201);
    }
}

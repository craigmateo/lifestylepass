<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Venue;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    // GET /api/activities?from=YYYY-MM-DD&to=YYYY-MM-DD
    public function index(Request $request)
    {
        $from = $request->query('from')
            ? Carbon::parse($request->query('from'))
            : now()->startOfDay();

        $to = $request->query('to')
            ? Carbon::parse($request->query('to'))
            : now()->addDays(14)->endOfDay();

        $items = Activity::with('venue:id,name,address')
            ->whereBetween('start_time', [$from, $to])
            ->orderBy('start_time')
            ->get();

        return response()->json($items);
    }

    // GET /api/venues/{venue}/activities?date=YYYY-MM-DD
    public function byVenue(Request $request, Venue $venue)
    {
        $query = $venue->activities()->orderBy('start_time');

        // Optional ?date=YYYY-MM-DD filter
        if ($request->filled('date')) {
            try {
                $day = Carbon::parse($request->query('date'))->startOfDay();
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Invalid date format',
                ], 422);
            }

            $query->whereBetween('start_time', [
                $day,
                (clone $day)->endOfDay(),
            ]);
        } else {
            // default: upcoming from today
            $query->where('start_time', '>=', now()->startOfDay());
        }

        $items = $query->get();

        return response()->json($items);
    }

    // POST /api/activities
    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id'    => ['required', 'exists:venues,id'],
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_time'  => ['required', 'date'],
            'end_time'    => ['nullable', 'date', 'after_or_equal:start_time'],
            'capacity'    => ['nullable', 'integer', 'min:1'],
        ]);

        $activity = Activity::create($data);

        return response()->json(
            $activity->load('venue:id,name,address'),
            201
        );
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Venue;

class VenueController extends Controller
{
   public function index(Request $request)
{
    $q = Venue::query()->select(
        'id',
        'name',
        'address',
        'type',
        'city',
        'latitude',
        'longitude'
    );

    if ($request->filled('city')) {
        $q->where('city', $request->query('city'));
    }

    return response()->json($q->orderBy('name')->get());
}

}

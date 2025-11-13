<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'capacity',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}

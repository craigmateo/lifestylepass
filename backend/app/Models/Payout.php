<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = ['venue_id','amount','period_start','period_end','paid_status'];

    public function venue() { return $this->belongsTo(Venue::class); }
}


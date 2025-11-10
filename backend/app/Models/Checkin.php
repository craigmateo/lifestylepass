<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkin extends Model
{
    use HasFactory;

    protected $fillable = ['user_id','venue_id','timestamp'];

    public function user() { return $this->belongsTo(User::class); }
    public function venue() { return $this->belongsTo(Venue::class); }
}


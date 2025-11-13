<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

protected $fillable = [
    'name',
    'address',
    'type',
    'city',
    'owner_id',
    'latitude',
    'longitude',
];

    public function activities()
{
    return $this->hasMany(Activity::class);
}

}



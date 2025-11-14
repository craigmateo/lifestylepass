<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Venue;
use App\Models\Activity;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $venues = Venue::all();

        if ($venues->isEmpty()) {
            $this->command->warn('No venues found. Seed some venues first.');
            return;
        }

        $today = Carbon::today();

        foreach ($venues as $venue) {
            for ($i = 0; $i < 5; $i++) { // today + next 4 days
                $day = $today->copy()->addDays($i);

                // Morning session
                Activity::create([
                    'venue_id'    => $venue->id,
                    'title'       => 'Morning Session',
                    'description' => 'General training and open session.',
                    'start_time'  => $day->copy()->setTime(9, 0, 0),
                    'end_time'    => $day->copy()->setTime(10, 30, 0),
                    'capacity'    => 20,
                ]);

                // Evening session
                Activity::create([
                    'venue_id'    => $venue->id,
                    'title'       => 'Evening Session',
                    'description' => 'Instructor-led class for all levels.',
                    'start_time'  => $day->copy()->setTime(18, 0, 0),
                    'end_time'    => $day->copy()->setTime(19, 30, 0),
                    'capacity'    => 15,
                ]);
            }
        }

        $this->command->info('Demo activities seeded for the next 5 days.');
    }
}

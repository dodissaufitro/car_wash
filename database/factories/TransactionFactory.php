<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $vehicle = \App\Models\Vehicle::factory()->create();

        return [
            'customer_id' => $vehicle->customer_id,
            'vehicle_id'  => $vehicle->id,
            'tanggal'     => now()->toDateString(),
            'status'      => 'Pending',
            'total'       => 25000,
        ];
    }
}

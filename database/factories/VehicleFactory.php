<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id'     => \App\Models\Customer::factory(),
            'jenis_kendaraan' => $this->faker->randomElement(['Motor', 'Mobil']),
            'merk'            => $this->faker->randomElement(['Honda', 'Yamaha', 'Toyota', 'Suzuki']),
            'nomor_polisi'    => strtoupper($this->faker->bothify('B ### ???')),
        ];
    }
}

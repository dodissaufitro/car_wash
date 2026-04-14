<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_service' => $this->faker->randomElement(['Cuci Motor', 'Cuci Mobil', 'Poles Motor', 'Poles Mobil']),
            'harga'        => $this->faker->randomElement([15000, 25000, 50000, 75000]),
            'deskripsi'    => null,
        ];
    }
}

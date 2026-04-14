<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama'   => $this->faker->name(),
            'no_hp'  => $this->faker->numerify('08##########'),
            'alamat' => $this->faker->address(),
        ];
    }
}

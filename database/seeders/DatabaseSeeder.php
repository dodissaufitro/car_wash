<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CarWashSeeder::class);
        $this->call(RoleSeeder::class);

        $adminRole    = Role::where('slug', 'admin')->first();
        $kasirRole    = Role::where('slug', 'kasir')->first();
        $teknisiRole  = Role::where('slug', 'teknisi')->first();

        User::factory()->create([
            'name'     => 'Administrator',
            'email'    => 'admin@carwash.test',
            'password' => Hash::make('password'),
            'role_id'  => $adminRole?->id,
        ]);

        User::factory()->create([
            'name'     => 'Budi Kasir',
            'email'    => 'kasir@carwash.test',
            'password' => Hash::make('password'),
            'role_id'  => $kasirRole?->id,
        ]);

        User::factory()->create([
            'name'     => 'Andi Teknisi',
            'email'    => 'teknisi@carwash.test',
            'password' => Hash::make('password'),
            'role_id'  => $teknisiRole?->id,
        ]);
    }
}

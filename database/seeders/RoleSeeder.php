<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'        => 'Administrator',
                'slug'        => 'admin',
                'description' => 'Akses penuh ke seluruh fitur aplikasi',
                'permissions' => array_keys(Role::allPermissions()),
            ],
            [
                'name'        => 'Kasir',
                'slug'        => 'kasir',
                'description' => 'Kelola transaksi dan lihat laporan',
                'permissions' => [
                    'dashboard',
                    'transactions.view',
                    'transactions.create',
                    'transactions.edit',
                    'reports.view',
                    'queue.view',
                ],
            ],
            [
                'name'        => 'Teknisi',
                'slug'        => 'teknisi',
                'description' => 'Lihat dan update status antrian cuci',
                'permissions' => [
                    'dashboard',
                    'queue.view',
                    'queue.update',
                ],
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}

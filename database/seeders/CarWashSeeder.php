<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarWashSeeder extends Seeder
{
    public function run()
    {
        // CUSTOMER
        DB::table('customers')->insert([
            ['id' => 1, 'nama' => 'Budi Santoso', 'no_hp' => '081234567890', 'alamat' => 'Jakarta', 'created_at' => now()],
            ['id' => 2, 'nama' => 'Andi Wijaya', 'no_hp' => '082345678901', 'alamat' => 'Bandung', 'created_at' => now()],
            ['id' => 3, 'nama' => 'Siti Rahma', 'no_hp' => '083456789012', 'alamat' => 'Bekasi', 'created_at' => now()],
        ]);

        // VEHICLES
        DB::table('vehicles')->insert([
            ['id' => 1, 'customer_id' => 1, 'jenis_kendaraan' => 'Motor', 'merk' => 'Honda Beat', 'nomor_polisi' => 'B 1234 ABC', 'created_at' => now()],
            ['id' => 2, 'customer_id' => 2, 'jenis_kendaraan' => 'Mobil', 'merk' => 'Toyota Avanza', 'nomor_polisi' => 'B 5678 DEF', 'created_at' => now()],
            ['id' => 3, 'customer_id' => 3, 'jenis_kendaraan' => 'Mobil', 'merk' => 'Honda Jazz', 'nomor_polisi' => 'B 9999 XYZ', 'created_at' => now()],
        ]);

        // SERVICE CATEGORIES
        DB::table('service_categories')->insert([
            ['id' => 1, 'nama' => 'Cuci',    'ikon' => 'Droplets',   'urutan' => 1, 'created_at' => now()],
            ['id' => 2, 'nama' => 'Poles',   'ikon' => 'Sparkles',   'urutan' => 2, 'created_at' => now()],
            ['id' => 3, 'nama' => 'Salon',   'ikon' => 'Star',       'urutan' => 3, 'created_at' => now()],
            ['id' => 4, 'nama' => 'Lainnya', 'ikon' => 'MoreHorizontal', 'urutan' => 4, 'created_at' => now()],
        ]);

        // SERVICES
        DB::table('services')->insert([
            ['id' => 1, 'category_id' => 1, 'nama_service' => 'Cuci Motor',    'harga' => 15000,  'deskripsi' => 'Cuci motor biasa',   'created_at' => now()],
            ['id' => 2, 'category_id' => 1, 'nama_service' => 'Cuci Mobil',    'harga' => 40000,  'deskripsi' => 'Cuci mobil biasa',   'created_at' => now()],
            ['id' => 3, 'category_id' => 2, 'nama_service' => 'Cuci + Wax',    'harga' => 80000,  'deskripsi' => 'Cuci dan waxing',    'created_at' => now()],
            ['id' => 4, 'category_id' => 3, 'nama_service' => 'Salon Mobil',   'harga' => 150000, 'deskripsi' => 'Salon lengkap',      'created_at' => now()],
            ['id' => 5, 'category_id' => 2, 'nama_service' => 'Poles Motor',   'harga' => 35000,  'deskripsi' => 'Poles bodi motor',   'created_at' => now()],
            ['id' => 6, 'category_id' => 2, 'nama_service' => 'Poles Mobil',   'harga' => 75000,  'deskripsi' => 'Poles bodi mobil',   'created_at' => now()],
            ['id' => 7, 'category_id' => 3, 'nama_service' => 'Coating',       'harga' => 200000, 'deskripsi' => 'Nano coating',       'created_at' => now()],
            ['id' => 8, 'category_id' => 4, 'nama_service' => 'Parfum Kabin',  'harga' => 20000,  'deskripsi' => 'Parfum kabin mobil', 'created_at' => now()],
        ]);

        // EMPLOYEES
        DB::table('employees')->insert([
            ['id' => 1, 'nama' => 'Joko', 'jabatan' => 'Washer', 'no_hp' => '0811111111', 'created_at' => now()],
            ['id' => 2, 'nama' => 'Rudi', 'jabatan' => 'Kasir', 'no_hp' => '0822222222', 'created_at' => now()],
        ]);

        // TRANSACTIONS
        DB::table('transactions')->insert([
            [
                'id' => 1,
                'customer_id' => 1,
                'vehicle_id' => 1,
                'tanggal' => Carbon::now(),
                'total' => 15000,
                'status' => 'Selesai',
                'created_at' => now(),
            ],
        ]);

        // TRANSACTION DETAILS
        DB::table('transactions_details')->insert([
            [
                'id' => 1,
                'transaction_id' => 1,
                'service_id' => 1,
                'qty' => 1,
                'harga' => 15000,
                'subtotal' => 15000,
                'created_at' => now(),
            ],
        ]);

        // PAYMENTS
        DB::table('payments')->insert([
            [
                'id' => 1,
                'transaction_id' => 1,
                'metode' => 'Cash',
                'jumlah_bayar' => 20000,
                'kembalian' => 5000,
                'created_at' => now(),
            ],
        ]);
    }
}

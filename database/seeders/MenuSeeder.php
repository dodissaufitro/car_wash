<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Kategori Minuman & Makanan
        DB::table('service_categories')->insertOrIgnore([
            ['id' => 5, 'nama' => 'Minuman', 'ikon' => 'GlassWater', 'urutan' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'nama' => 'Makanan', 'ikon' => 'Utensils',   'urutan' => 6, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Minuman (14 item)
        DB::table('services')->insertOrIgnore([
            ['id' => 9, 'category_id' => 5, 'nama_service' => 'Kopi Hitam',   'harga' => 8000, 'deskripsi' => 'Kopi hitam tubruk',  'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'category_id' => 5, 'nama_service' => 'Kopi Susu',    'harga' => 12000, 'deskripsi' => 'Kopi susu segar',    'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'category_id' => 5, 'nama_service' => 'Cappuccino',   'harga' => 15000, 'deskripsi' => 'Cappuccino panas',   'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'category_id' => 5, 'nama_service' => 'Latte',        'harga' => 18000, 'deskripsi' => 'Cafe latte panas',   'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'category_id' => 5, 'nama_service' => 'Es Kopi',      'harga' => 13000, 'deskripsi' => 'Kopi susu es',       'created_at' => now(), 'updated_at' => now()],
            ['id' => 14, 'category_id' => 5, 'nama_service' => 'Teh Manis',    'harga' => 5000, 'deskripsi' => 'Teh manis panas',    'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'category_id' => 5, 'nama_service' => 'Teh Tarik',    'harga' => 10000, 'deskripsi' => 'Teh tarik khas',     'created_at' => now(), 'updated_at' => now()],
            ['id' => 16, 'category_id' => 5, 'nama_service' => 'Es Teh',       'harga' => 7000, 'deskripsi' => 'Es teh manis',       'created_at' => now(), 'updated_at' => now()],
            ['id' => 17, 'category_id' => 5, 'nama_service' => 'Jeruk Hangat', 'harga' => 8000, 'deskripsi' => 'Jeruk peras panas',  'created_at' => now(), 'updated_at' => now()],
            ['id' => 18, 'category_id' => 5, 'nama_service' => 'Es Jeruk',     'harga' => 10000, 'deskripsi' => 'Es jeruk segar',     'created_at' => now(), 'updated_at' => now()],
            ['id' => 19, 'category_id' => 5, 'nama_service' => 'Air Mineral',  'harga' => 5000, 'deskripsi' => 'Air mineral botol',  'created_at' => now(), 'updated_at' => now()],
            ['id' => 20, 'category_id' => 5, 'nama_service' => 'Jus Alpukat',  'harga' => 15000, 'deskripsi' => 'Jus alpukat segar',  'created_at' => now(), 'updated_at' => now()],
            ['id' => 21, 'category_id' => 5, 'nama_service' => 'Jus Mangga',   'harga' => 15000, 'deskripsi' => 'Jus mangga segar',   'created_at' => now(), 'updated_at' => now()],
            ['id' => 22, 'category_id' => 5, 'nama_service' => 'Milo Hangat',  'harga' => 10000, 'deskripsi' => 'Milo panas coklat',  'created_at' => now(), 'updated_at' => now()],
        ]);

        // Makanan (14 item)
        DB::table('services')->insertOrIgnore([
            ['id' => 23, 'category_id' => 6, 'nama_service' => 'Nasi Goreng',    'harga' => 20000, 'deskripsi' => 'Nasi goreng spesial',    'created_at' => now(), 'updated_at' => now()],
            ['id' => 24, 'category_id' => 6, 'nama_service' => 'Mie Goreng',     'harga' => 18000, 'deskripsi' => 'Mie goreng telur',       'created_at' => now(), 'updated_at' => now()],
            ['id' => 25, 'category_id' => 6, 'nama_service' => 'Nasi Uduk',      'harga' => 15000, 'deskripsi' => 'Nasi uduk + lauk',       'created_at' => now(), 'updated_at' => now()],
            ['id' => 26, 'category_id' => 6, 'nama_service' => 'Soto Ayam',      'harga' => 20000, 'deskripsi' => 'Soto ayam kuah bening',  'created_at' => now(), 'updated_at' => now()],
            ['id' => 27, 'category_id' => 6, 'nama_service' => 'Bakso',          'harga' => 18000, 'deskripsi' => 'Bakso sapi kuah',        'created_at' => now(), 'updated_at' => now()],
            ['id' => 28, 'category_id' => 6, 'nama_service' => 'Gado-gado',      'harga' => 15000, 'deskripsi' => 'Gado-gado bumbu kacang', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 29, 'category_id' => 6, 'nama_service' => 'Ayam Bakar',     'harga' => 25000, 'deskripsi' => 'Ayam bakar bumbu rujak', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 30, 'category_id' => 6, 'nama_service' => 'Nasi Ayam',      'harga' => 22000, 'deskripsi' => 'Nasi + ayam goreng',     'created_at' => now(), 'updated_at' => now()],
            ['id' => 31, 'category_id' => 6, 'nama_service' => 'Kentang Goreng', 'harga' => 12000, 'deskripsi' => 'Kentang goreng renyah',  'created_at' => now(), 'updated_at' => now()],
            ['id' => 32, 'category_id' => 6, 'nama_service' => 'Pisang Goreng',  'harga' => 8000, 'deskripsi' => 'Pisang goreng crispy',   'created_at' => now(), 'updated_at' => now()],
            ['id' => 33, 'category_id' => 6, 'nama_service' => 'Roti Bakar',     'harga' => 10000, 'deskripsi' => 'Roti bakar selai',       'created_at' => now(), 'updated_at' => now()],
            ['id' => 34, 'category_id' => 6, 'nama_service' => 'Indomie Goreng', 'harga' => 12000, 'deskripsi' => 'Indomie goreng telur',   'created_at' => now(), 'updated_at' => now()],
            ['id' => 35, 'category_id' => 6, 'nama_service' => 'Bubur Ayam',     'harga' => 15000, 'deskripsi' => 'Bubur ayam topping',     'created_at' => now(), 'updated_at' => now()],
            ['id' => 36, 'category_id' => 6, 'nama_service' => 'Lontong Sayur',  'harga' => 15000, 'deskripsi' => 'Lontong sayur lodeh',    'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

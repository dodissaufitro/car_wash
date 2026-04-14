<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'jenis_kendaraan',
        'merk',
        'nomor_polisi'
    ];

    // Relasi ke customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi ke transaksi
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
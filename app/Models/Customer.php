<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'no_hp',
        'alamat'
    ];

    // Relasi ke kendaraan
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    // Relasi ke transaksi
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
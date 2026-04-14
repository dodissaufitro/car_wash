<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_service',
        'harga',
        'deskripsi'
    ];

    // Relasi ke detail transaksi
    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'nama_service',
        'emoji',
        'image',
        'harga',
        'deskripsi',
    ];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    // Relasi ke detail transaksi
    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}

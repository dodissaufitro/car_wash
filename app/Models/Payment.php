<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'transaction_id',
        'metode',
        'jumlah_bayar',
        'kembalian'
    ];

    // Relasi ke transaksi
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
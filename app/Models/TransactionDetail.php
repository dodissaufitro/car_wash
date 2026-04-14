<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    protected $table = 'transactions_details';

    protected $fillable = [
        'transaction_id',
        'service_id',
        'qty',
        'harga',
        'subtotal'
    ];

    // Relasi ke transaksi
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // Relasi ke service
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
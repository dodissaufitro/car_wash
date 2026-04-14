<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'nomor_antrian',
        'status'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
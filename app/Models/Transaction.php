<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'vehicle_id',
        'tanggal',
        'total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'float',
        ];
    }

    // Relasi ke customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi ke kendaraan
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    // Relasi ke detail layanan
    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    // Relasi ke pembayaran
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    // Relasi ke antrian
    public function queue()
    {
        return $this->hasOne(Queue::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'permissions',
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    /** Daftar semua izin yang tersedia dalam sistem. */
    public static function allPermissions(): array
    {
        return [
            'dashboard'     => 'Lihat Dashboard',
            'users.view'    => 'Lihat Pengguna',
            'users.create'  => 'Tambah Pengguna',
            'users.edit'    => 'Edit Pengguna',
            'users.delete'  => 'Hapus Pengguna',
            'roles.view'    => 'Lihat Hak Akses',
            'roles.create'  => 'Tambah Hak Akses',
            'roles.edit'    => 'Edit Hak Akses',
            'roles.delete'  => 'Hapus Hak Akses',
            'transactions.view'   => 'Lihat Transaksi',
            'transactions.create' => 'Buat Transaksi',
            'transactions.edit'   => 'Edit Transaksi',
            'transactions.delete' => 'Hapus Transaksi',
            'reports.view'  => 'Lihat Laporan',
            'queue.view'    => 'Lihat Antrian',
            'queue.update'  => 'Update Status Antrian',
        ];
    }

    /** @return Collection<int, self> */
    public static function allWithUsers(): Collection
    {
        return self::withCount('users')->orderBy('id')->get();
    }
}

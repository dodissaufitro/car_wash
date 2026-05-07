<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    protected $fillable = ['nama', 'ikon', 'urutan'];

    public function services()
    {
        return $this->hasMany(Service::class, 'category_id');
    }
}

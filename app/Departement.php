<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Departement extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'libelle', 'interne', 'chef_id'
    ];

    public function employes() {
        return $this->hasMany(Employe::class);
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Employe extends Model
{
    use Notifiable;
    use SoftDeletes;
    //
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'nom', 'prenom','sexe', 'email', 'departement_id','dateNaissance','photo', 'isAdmin', 'user_id'
    ];

    public function departement() {
        return $this->belongsTo(Departement::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
}

<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;  // ← this is what makes createToken() work

    protected $table      = 'user';
    protected $primaryKey = 'userID';
    public $timestamps    = false;

    protected $fillable = [
        'name', 'dob', 'email', 'password', 'edu_info_qn'
    ];

    protected $hidden = ['password'];
}
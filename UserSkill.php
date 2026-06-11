<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSkill extends Model
{
    protected $table = 'user_skills';
    protected $fillable = ['useruserID', 'skillsid', 'link_of_project', 'exprience'];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'useruserID', 'userID');
    }
    
    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skillsid');
    }
}
<?php
// app/Models/UserEducation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserEducation extends Model
{
    protected $table = 'user_education';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'qualification_type',
        'institution_name',
        'board_university',
        'degree_name',
        'major_subject',
        'completion_year',
        'percentage_score',
        'cgpa',
        'description'
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'userID');
    }
}
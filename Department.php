<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';

    public function university()
    {
        return $this->belongsTo(University::class, 'universitiesid');
    }

    public function admissionSeasons()
    {
        return $this->hasMany(AdmissionSeason::class, 'departmentsid');
    }
    
    // Get departments by university ID
    public static function getByUniversity($universityId)
    {
        return self::where('universitiesid', $universityId)->get();
    }
}
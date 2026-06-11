<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';
 public $timestamps = false;
  protected $fillable = [
        'name',
        'short_name',
        'universitiesid',
        'description',
        'total_cridits',
        'cridit_fee',
        'total_tution'
    ];
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
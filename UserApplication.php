<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserApplication extends Model
{
    use HasFactory;

    protected $table = 'user_applications';
    
    // Disable automatic timestamps since your table doesn't have them
    public $timestamps = false;

    protected $fillable = [
        'name',
        'useruserID',
        'universitiesid',
        'dob',
        'passport_number',
        'email',
        'current_address',
        'nationality',
        'program',
        'passing_year',
        'result',
        'transcript',
        'eng_test_type',
        'eng_test_score',
        'eng_test_doc',
        'standard_test_type',
        'standard_test_score',
        'program_name',
        'program_level',
        'cv',
        'admission_seasonid',
        'sop',
        'status'  // Add this line for application status
    ];

    // Optional: Add relationship to user
    public function user()
    {
        return $this->belongsTo(User::class, 'useruserID', 'userID');
    }

    // Optional: Add relationship to university
    public function university()
    {
        return $this->belongsTo(University::class, 'universitiesid');
    }

    // Optional: Add relationship to admission season
    public function admissionSeason()
    {
        return $this->belongsTo(AdmissionSeason::class, 'admission_seasonid');
    }
}
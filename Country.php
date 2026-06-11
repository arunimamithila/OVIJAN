<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';
    
    // Disable timestamps since your table doesn't have created_at/updated_at
    public $timestamps = false;
    
    protected $fillable = [
        'name',        
        'rank',
        'detail',
        'useruserID',
        'flag',
        'capital',
        'language',
        'currency',
        'visa_success_rate',
        'description',
        'image_url'
    ];
    
    // Explicitly define the foreign key relationship
    public function universities()
    {
        return $this->hasMany(University::class, 'country_id', 'id');
    }
    
    // Optional: Relationship to User if needed
    public function user()
    {
        return $this->belongsTo(User::class, 'useruserID', 'userID');
    }
    //Add this relationship for scholarships
    public function scholarships()
    {
        return $this->hasMany(Scholarship::class, 'country_id', 'id');
    }
}
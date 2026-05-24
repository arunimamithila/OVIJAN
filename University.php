<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $table = 'universities';
    
    // Disable timestamps since your table doesn't have created_at/updated_at
    public $timestamps = false;
    
    protected $fillable = [
        'country_id', 
        'name',
        'rank',
        'detail',
        'short_name',
        'location', 
        'acceptance_rate',
        'students',
        'estavlished',
        'image_url',
        'description',
        'undergraduate',
        'graduate',
        'website',
        'email',
        'phone'
    ];
    
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }
}
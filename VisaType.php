<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisaType extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name', 'countriesid', 'category', 'description', 
        'duration', 'fee', 'requirements'
    ];
    
    protected $casts = [
        'requirements' => 'array'
    ];
    
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
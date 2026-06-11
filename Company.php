<?php
// app/Models/Company.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens; // Add this line

class Company extends Model
{
    use HasFactory, HasApiTokens; // Add HasApiTokens here

    protected $table = 'companies';
    
    protected $fillable = [
        'name', 'logo', 'color', 'website', 'email', 'phone',
        'address', 'city', 'country_id', 'industry', 'size', 'description',
        'admin_name', 'admin_email', 'password', 'admin_status',
        'created_by', 'updated_by'
    ];

    // Hide password when serializing
    protected $hidden = [
        'password'
    ];

    public function jobs()
    {
        return $this->hasMany(Job::class, 'company_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}
<?php
// app/Models/Job.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'jobs';
    protected $primaryKey = 'id';
    public $timestamps = true;
    
    protected $fillable = [
        'company_id', 'title', 'location', 'type', 'salary_min', 'salary_max',
        'salary_currency', 'posted_date', 'deadline', 'description', 'requirements',
        'benefits', 'experience_level', 'applicants_count', 'is_remote', 'is_featured',
        'is_active', 'views', 'job_link'
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'is_remote' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'posted_date' => 'datetime',
        'deadline' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_jobs', 'job_id', 'user_id')
                    ->withPivot('saved_date')
                    ->withTimestamps();
    }
}
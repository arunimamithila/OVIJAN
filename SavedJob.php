<?php
// app/Models/SavedJob.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    use HasFactory;

    protected $table = 'saved_jobs';
    public $timestamps = false;
    
    protected $fillable = [
        'user_id', 'job_id', 'saved_date', 'created_at'
    ];

    protected $casts = [
        'saved_date' => 'datetime',
        'created_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'userID');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
<?php
// app/Models/ImportantNotice.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportantNotice extends Model
{
    use HasFactory;

    protected $table = 'important_notices';
    
    protected $fillable = ['title', 'content', 'is_active', 'expires_at'];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'date'
    ];
}
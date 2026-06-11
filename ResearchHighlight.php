<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchHighlight extends Model
{
    protected $table = 'research_highlights';
    protected $primaryKey = 'id';
    
    // Disable timestamps since your table doesn't have created_at/updated_at
    public $timestamps = false;
    
    // Add fillable fields to allow mass assignment
    protected $fillable = [
        'title',
        'universitiesid',
        'category',
        'description'
    ];
     
    // Relationship with university
    public function university()
    {
        return $this->belongsTo(University::class, 'universitiesid');
    }
}
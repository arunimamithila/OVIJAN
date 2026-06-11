<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class University extends Model
{
    use HasApiTokens;
    protected $table = 'universities';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'rank',
        'detail',
        'country_id',
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
        'phone',
        'admin_name',
        'admin_email',
        'admin_password',
        'admin_status',
        'status'
    ];

    protected $hidden = [
        'admin_password'
    ];

    // COUNTRY RELATION (already exists - keep it)
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    // DEPARTMENTS RELATION (already exists - keep it)
    public function departments()
    {
        return $this->hasMany(Department::class, 'universitiesid');
    }

    // RESEARCH RELATION (already exists - keep it)
    public function researchHighlights()
    {
        return $this->hasMany(ResearchHighlight::class, 'universitiesid');
    }

    // ========== ADD THESE NEW METHODS BELOW ==========

    // Get all universities for AI recommendation
    public static function getForRecommendation()
    {
        return self::with('country')->get();
    }

    // Format university data for AI
    public function toAIData()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'country' => $this->country ? $this->country->name : 'International',
            'rank' => $this->rank,
            'location' => $this->location,
            'acceptance_rate' => $this->acceptance_rate,
            'students' => $this->students,
            'established' => $this->estavlished,
            'description' => $this->description,
            'undergraduate_fee' => $this->undergraduate,
            'graduate_fee' => $this->graduate,
            'website' => $this->website,
            'email' => $this->email,
            'phone' => $this->phone
        ];
    }
}

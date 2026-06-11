<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Scholarship extends Model
{
    use HasFactory;

    protected $table = 'scholarships';

    protected $fillable = [
        'country_id',
        'title',
        'provider',
        'amount',
        'deadline',
        'duration',
        'field',
        'description',
        'eligibility',
        'benefits',
        'apply_link',
        'level',
        'language',
        'tags',
        'stats_applicants',
        'stats_success',
        'stats_founded',
        'reviews',
        'gallery',
        'requirements'
    ];

    protected $casts = [
        'deadline' => 'date',
        'tags' => 'array',
        'reviews' => 'array',
        'gallery' => 'array',
        'requirements' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    // Relationship with Country
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    // Accessor to get country name
    public function getCountryNameAttribute()
    {
        return $this->country ? $this->country->name : null;
    }

    // Accessor to get country code
    public function getCountryCodeAttribute()
    {
        return $this->country ? $this->country->flag : null;
    }

    // Accessor to get formatted deadline
    public function getFormattedDeadlineAttribute()
    {
        return $this->deadline ? $this->deadline->format('M d, Y') : null;
    }

    // Accessor to get days remaining
    public function getDaysRemainingAttribute()
    {
        if (!$this->deadline) return null;
        
        $now = now();
        $deadline = $this->deadline;
        
        if ($now > $deadline) {
            return ['text' => 'Closed', 'color' => '#9ca3af', 'bg' => '#f3f4f6'];
        }
        
        $diff = $now->diffInDays($deadline);
        
        if ($diff <= 30) {
            return ['text' => "{$diff}d left", 'color' => '#b45309', 'bg' => '#fef3c7'];
        }
        
        return ['text' => "{$diff}d left", 'color' => '#166534', 'bg' => '#dcfce7'];
    }

    // Scope for active scholarships (not expired)
    public function scopeActive($query)
    {
        return $query->where('deadline', '>=', now());
    }

    // Scope for searching
    public function scopeSearch($query, $searchTerm)
    {
        if (!$searchTerm) return $query;
        
        return $query->where(function($q) use ($searchTerm) {
            $q->where('title', 'LIKE', "%{$searchTerm}%")
              ->orWhere('provider', 'LIKE', "%{$searchTerm}%")
              ->orWhere('field', 'LIKE', "%{$searchTerm}%")
              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
              ->orWhereJsonContains('tags', $searchTerm);
        });
    }

    // Scope for filtering by country
    public function scopeByCountry($query, $countryId)
    {
        if ($countryId && $countryId !== 'All') {
            return $query->where('country_id', $countryId);
        }
        return $query;
    }

    // Scope for sorting
    public function scopeApplySort($query, $sortBy)
    {
        if ($sortBy === 'deadline') {
            return $query->orderBy('deadline', 'asc');
        } elseif ($sortBy === 'amount') {
            return $query->orderByRaw('CAST(REGEXP_REPLACE(amount, "[^0-9]", "") AS UNSIGNED) asc');
        }
        return $query->orderBy('deadline', 'asc');
    }
}
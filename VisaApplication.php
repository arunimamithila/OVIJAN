<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaApplication extends Model
{
    protected $table = 'visa_applications';

    protected $fillable = [
        'application_reference',
        'email',
        'full_name',
        'date_of_birth',
        'nationality',
        'passport_number',
        'passport_expiry_date',
        'phone_number',
        'home_address',
        'intended_travel_date',
        'university_name',
        'course_name',
        'acceptance_letter_path',
        'job_title',
        'company_name',
        'job_offer_letter_path',
        'proof_of_funds_path',
        'has_criminal_record',
        'has_visa_refusal',
        'selected_country_id',
        'selected_country_name',
        'visa_type',
        'application_status',
        'submitted_at',
        'agree_terms',
        'agree_accuracy',
        'secure_access_code'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'passport_expiry_date' => 'date',
        'intended_travel_date' => 'date',
        'submitted_at' => 'datetime',
        'has_criminal_record' => 'boolean',
        'has_visa_refusal' => 'boolean',
        'agree_terms' => 'boolean',
        'agree_accuracy' => 'boolean',
    ];
}
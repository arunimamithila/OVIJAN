<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBudgetCalculation extends Model
{
    protected $table = 'user_budget_calculations';
    public $timestamps = false; // table only has created_at, not updated_at

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id', 'selected_country_id',
        'monthly_budget_usd', 'scholarship_usd',
        'part_time_hours', 'savings_usd', 'results_json'
    ];
}
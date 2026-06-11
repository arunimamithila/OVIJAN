<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CityCosting extends Model
{
    protected $table = 'city_cost_of_living';
    public $timestamps = false;

    protected $fillable = [
        'city_name', 'country_id', 'latitude', 'longitude',
        'rent', 'food', 'transport', 'utilities',
        'part_time_wage', 'max_work_hours', 'currency_symbol'
    ];

    // Each city belongs to one country
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}
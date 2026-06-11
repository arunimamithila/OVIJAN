<?php
// app/Models/EventRegistration.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $table = 'event_registrations';
    protected $fillable = ['event_id', 'user_id', 'user_name', 'user_email', 'user_phone'];
    public $timestamps = false;
}
<?php
// app/Models/Event.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    protected $fillable = ['type', 'title', 'event_date', 'event_time', 'host_name', 'spots_available', 'description'];
    public $timestamps = false;
}
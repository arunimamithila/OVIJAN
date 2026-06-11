<?php
// app/Models/CommunityGuideline.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityGuideline extends Model
{
    protected $table = 'community_guidelines';
    protected $fillable = ['icon', 'title', 'body', 'display_order'];
    public $timestamps = false;
}
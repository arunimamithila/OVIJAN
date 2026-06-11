<?php
// app/Models/PostTag.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostTag extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'tag_name'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
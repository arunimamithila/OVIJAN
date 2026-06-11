<?php
// app/Models/Comment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';
    protected $fillable = ['post_id', 'user_id', 'content'];
    public $timestamps = false;
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'userID');
    }
    
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
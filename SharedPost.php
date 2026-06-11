<?php
// app/Models/SharedPost.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedPost extends Model
{
    protected $table = 'shared_posts';
    protected $fillable = ['original_post_id', 'user_id', 'shared_at'];
    public $timestamps = false;
    
    public function originalPost()
    {
        return $this->belongsTo(Post::class, 'original_post_id');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'userID');
    }
}
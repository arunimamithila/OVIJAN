<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    protected $fillable = ['user_id', 'content', 'image_url', 'likes_count', 'comments_count', 'shares_count', 'created_at', 'updated_at'];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'userID');
    }
    
    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    public function savedBy()
    {
        return $this->hasMany(SavedPost::class);
    }
    
    public function sharedBy()
    {
        return $this->hasMany(SharedPost::class, 'original_post_id');
    }

    // Accessor for formatted post data with user info
    public function getFormattedDataAttribute()
    {
        $user = $this->user;
        return [
            'id' => $this->id,
            'author' => $user ? $user->name : 'Unknown',
            'role' => $user ? $user->headline : 'User',
            'time' => $this->created_at ? $this->created_at->diffForHumans() : 'Just now',
            'content' => $this->content,
            'likes' => $this->likes_count ?? 0,
            'comments' => $this->comments_count ?? 0,
            'image' => $this->image_url,
            'avatar' => $user ? $user->profile_image : null,
            'user_id' => $this->user_id
        ];
    }
}
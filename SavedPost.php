<?php
// app/Models/SavedPost.php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class SavedPost extends Model
{
    // saved_posts table has no updated_at column
    public $timestamps = false;
 
    // Use created_at only
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
 
    protected $fillable = [
        'post_id',
        'user_id',
    ];
 
    protected $casts = [
        'post_id'    => 'integer',
        'user_id'    => 'integer',
        'created_at' => 'datetime',
    ];
 
    /* ── Relationships ── */
 
    /** The post that was saved */
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
 
    /** The user who saved the post */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
 

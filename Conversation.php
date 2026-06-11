<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $table = 'conversations';
    protected $fillable = ['user1_id', 'user2_id', 'last_message', 'last_message_time'];
    
    protected $casts = [
        'last_message_time' => 'datetime'
    ];
    
    public function user1()
    {
        return $this->belongsTo(User::class, 'user1_id', 'userID');
    }
    
    public function user2()
    {
        return $this->belongsTo(User::class, 'user2_id', 'userID');
    }
    
    public function messages()
    {
        return $this->hasMany(PrivateMessage::class);
    }
}
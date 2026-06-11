<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivateMessage extends Model
{
    protected $table = 'private_messages';
    protected $fillable = ['conversation_id', 'sender_id', 'receiver_id', 'message', 'is_read'];
    
    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime'
    ];
    
    public $timestamps = true;
    
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
    
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'userID');
    }
    
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'userID');
    }
}
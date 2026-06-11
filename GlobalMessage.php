<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalMessage extends Model
{
    protected $table = 'global_messages';
    protected $fillable = ['sender_id', 'sender_name', 'message'];
    public $timestamps = true;
    
    protected $casts = [
        'created_at' => 'datetime'
    ];
    
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'userID');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $fillable = ['code', 'name'];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

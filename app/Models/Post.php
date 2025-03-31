<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Define fillable fields to allow mass assignment
    protected $fillable = [
        'title',
        'content',
        'category',
        'published_at',
        'photo_link',
    ];

    // Optionally cast the published_at field to a datetime
    protected $casts = [
        'published_at' => 'datetime',
    ];
}
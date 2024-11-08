<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        "brand",
        "name",
        "color",
        "market_price",
        "gender",
        "image",
        "release_date",
        "release_year",
        "story",
        "price"
    ];
}

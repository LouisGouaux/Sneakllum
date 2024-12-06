<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_first_name',
        'user_last_name',
        'user_email',
        'user_phone',
        'shipping_address',
        'billing_address',
        'order_number',
        'total_amount'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function variants()
    {
        return $this->belongsToMany(Variant::class);
    }
}

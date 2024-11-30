<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private function calculate_amount($basket) {
        $total_amount = 0;
        foreach ($basket as $item) {
            $product = Product::find($item['product_id']);
            $price = $product->price;
            $quantity = $item['quantity'];
            $total_amount += $price*$quantity;
        }
        return $total_amount;
    }
}

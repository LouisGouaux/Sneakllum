<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store_guest_order(Request $request)
    {
        $basket = $request->validate([
            '*.product_id' => ['required', 'integer', 'exists:products,id'],
            '*.size_id' => ['required', 'integer', 'exists:sizes,id'],
            '*.color_id' => ['required', 'integer', 'exists:colors,id'],
            '*.quantity' => ['required', 'integer', 'min:1']
        ]);

        $amount = $this->calculate_amount($basket);

        return response()->json([
            'total_amount' => $amount
        ]);
    }

    private function calculate_amount($basket)
    {
        $total_amount = 0;
        foreach ($basket as $item) {
            $product = Product::find($item['product_id']);
            $price = $product->price;
            $quantity = $item['quantity'];
            $total_amount += $price * $quantity;
        }
        return $total_amount;
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Basket;
use App\Models\Variant;
use Illuminate\Http\Request;

class BasketController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            '*.product_id' => ['required', 'exists:products,id'],
            '*.size_id' => ['required', 'exists:products,id'],
            '*.color_id' => ['required', 'exists:products,id'],
            '*.quantity' => ['required', 'integer', 'min:1']
        ]);

        $basket = new Basket();
        $basket->user_id = $data ['user_id'];
        $basket->save();

        foreach ($data as $item) {
            $variant = Variant::where('product_id', $item['product_id'])
                ->where('size_id', $item['size_id'])
                ->where('color_id', $item['color_id'])
                ->first();
            if ($variant) {
                $basket->variants()->syncWithoutDetaching([
                    $variant->id => $item['quantity']
                ]);
            }

        }
        return response()->json([
            'success' => true,
            'data' => [
                'basket_id' => $basket->id
            ],
            'message' => 'Basket created successfully'
        ]);
    }
}

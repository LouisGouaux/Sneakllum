<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Basket;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BasketController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            '*.product_id' => ['required', 'exists:products,id'],
            '*.size_id' => ['required', 'exists:sizes,id'],
            '*.color_id' => ['required', 'exists:colors,id'],
            '*.quantity' => ['required', 'integer', 'min:1']
        ]);

        $basket = Basket::firstOrCreate(['user_id' => Auth::user()->id]);
        foreach ($data as $item) {
            $variant = Variant::where('product_id', $item['product_id'])
                ->where('size_id', $item['size_id'])
                ->where('color_id', $item['color_id'])
                ->first();
            if ($variant) {
                $basket->variants()->syncWithoutDetaching([
                    $variant->id => ['quantity' => $item['quantity']]
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

    public function show($id)
    {
        $basket = Basket::with(['variants.product', 'variants.size', 'variants.color'])->find($id);
        $products = $basket->variants->map(function ($variant) {
            return [
                'id' => $variant->product->id,
                'name' => $variant->product->name,
                'price' => $variant->product->price,
                'image' => $variant->product->image,
                'size' => [
                    'id' => $variant->size->id,
                    'value' => $variant->size->size
                ],
                'color' => [
                    'id' => $variant->color->id,
                    'value' => $variant->color->color
                ]
            ];
        });

        return response()->json($products);
    }
}

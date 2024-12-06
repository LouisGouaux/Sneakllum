<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{

    public function store_user_checkout(Request $request)
    {
        $data = $request->validate([
            'user_first_name' => ['required', 'string'],
            'user_last_name' => ['required', 'string'],
            'user_email' => ['required', 'email'],
            'user_phone' => ['required', 'string'],
            'shipping_address' => ['required', 'string']
        ]);

        $basket = $request->user()->basket->variants;
        $data['order_number'] = Str::random(6);
        $data['billing_address'] = $data['shipping_address'];
        $data['total_amount'] = $this->calculate_amount($basket);
        $order = Order::create($data);
        foreach ($basket as $item) {
            $variant = Variant::where('product_id', $item['product_id'])->where('size_id', $item['size_id'])->where('color_id', $item['color_id'])->first();
            $order->variants()->attach($variant->id, [
                'quantity' => $item['quantity']
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number
            ],
            'message' => 'Order created successfully'
        ], 201);
    }

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

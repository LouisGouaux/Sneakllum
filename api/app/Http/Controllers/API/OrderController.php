<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
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
        $data['user_id'] = $request->user()->id;
        $data['order_number'] = Str::random(6);
        $data['billing_address'] = $data['shipping_address'];
        $data['total_amount'] = $this->calculate_amount($basket);
        $order = Order::create($data);
        foreach ($basket as $item) {
            $variant = Variant::where('product_id', $item['product_id'])->where('size_id', $item['size_id'])->where('color_id', $item['color_id'])->first();
            $order->variants()->attach($variant->id, [
                'quantity' => $item->pivot->quantity
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order),
            'basket' => $basket,
            'message' => 'Order created successfully'
        ], 201);
    }

    public function store_guest_order(Request $request)
    {
        $basket = $request->validate([
            'basket.*product_id' => ['required', 'integer', 'exists:products,id'],
            'basket.*size_id' => ['required', 'integer', 'exists:sizes,id'],
            'basket.*color_id' => ['required', 'integer', 'exists:colors,id'],
            'basket.*quantity' => ['required', 'integer', 'min:1']
        ]);

        $order_data = $request->validate([
            'user_first_name' => ['required', 'string'],
            'user_last_name' => ['required', 'string'],
            'user_email' => ['required', 'email'],
            'user_phone' => ['required', 'string'],
            'shipping_address' => ['required', 'string'],
        ]);
        $order_data['order_number'] = Str::random(6);
        $order_data['billing_address'] = $order_data['shipping_address'];
        $order_data['total_amount'] = $this->calculate_amount($basket);
        $order = Order::create($order_data);
        foreach ($basket as $item) {
            $variant = Variant::where('product_id', $item['product_id'])->where('size_id', $item['size_id'])->where('color_id', $item['color_id'])->first();
            $order->variants()->attach($variant->id, [
                'quantity' => $item->pivot->quantity
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order),
            'message' => 'Order created successfully'
        ], 201);
    }

    public function get_user_orders(Request $request)
    {
        $orders = $request->user()->orders;

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders),
            'message' => 'orders retrived successfully'
        ]);
    }

    public function get_order_by_number(Request $request)
    {
        $data = $request->validate([
            'order_number' => ['required', 'string'],
            'user_last_name' => ['required', 'string']
        ]);
        $order = Order::where('order_number', $data['order_id'])
            ->where('order_last_name', $data['order_last_name'])
            ->first();

        return response(new OrderResource($order));
    }

    private function calculate_amount($basket)
    {
        $total_amount = 0;
        foreach ($basket as $item) {
            $product = Product::find($item['product_id']);
            $price = $product->price;
            $quantity = $item->pivot->quantity;
            $total_amount += $price * $quantity;
        }
        return $total_amount;
    }
}

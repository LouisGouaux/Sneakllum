<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_number,
            'user_first_name' => $this->user_first_name,
            'user_last_name' => $this->user_last_name,
            'user_email' => $this->user_email,
            'user_phone' => $this->user_phone,
            'total_amount' => $this->total_amount,
            'products' => $this->get_products($this->variants)
        ]
    }

    private function get_products($variants) {
        $products = array();
        foreach ($variants as $variant) {
            $product = [
                'name' => $variant->product->name,
                'price' => $variant->product->price /100,
                'image' => $variant->product->image
                'quantity' => $variant->quantity
            ];
            array_push($products, $product);
        }
        return $products;
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'name' => $this->name,
            'story' => $this->story,
            'gender' => $this->gender,
            'image' => $this->image,
            'market_price' => $this->market_price,
            'price' => $this->price,
            'sizes' => SizeResource::collection($this->sizes),
            'colors' => ColorResource::collection($this->colors)
        ];
    }
}

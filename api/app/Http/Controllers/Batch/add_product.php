<?php

namespace App\Http\Controllers\Batch;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Product;

class add_product extends Controller
{
    public function store_sneaker()
    {
        $response = Http::timeout(60)->get("http://54.37.12.181:1337/api/sneakers?pagination%5BwithCount%5D=true");
        if ($response->successful()) {
            $sneakers = $response->json("data");
            foreach ($sneakers as $sneaker) {
                $attributes = $sneaker['attributes'];

                Product::updateOrCreate(
                    ['sku' => $attributes['sku']],
                    [
                        'brand' => $attributes['brand'],
                        'name' => $attributes['name'],
                        'color' => $attributes['colorway'],
                        'market_price' => $attributes['estimatedMarketValue'],
                        'gender' => $attributes['gender'],
                        'image' => $attributes['image']['original'],
                        'release_date' => $attributes['releaseDate'],
                        'release_year' => (int)$attributes['releaseYear'],
                        'story' => $attributes['story'],
                        'price' => (int)$attributes['retailPrice'],
                    ]
                );

            }
        }
        return response()->json([
            "success" => true,
            "message" => "Products imported successfully"
        ]);

    }
}

<?php

namespace App\Http\Controllers\Batch;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Product;

class add_product extends Controller
{
    public function store_sneakers()
    {
        $current_page = 1;
        $has_more_pages = true;

        while ($has_more_pages) {
            $response = Http::timeout(60)->get("http://54.37.12.181:1337/api/sneakers", [
                'pagination[page]' => $current_page,
                'pagination[pageSize]' => 25, // Adjust the page size as needed
            ]);

            if ($response->successful()) {
                $sneakers = $response->json("data");
                $pagination = $response->json('meta.pagination');

                foreach ($sneakers as $sneaker) {
                    $this->store_or_update_sneaker($sneaker['attributes']);
                }

                $current_page++;
                $has_more_pages = $pagination['page'] < $pagination['pageCount'];
            } else {
                $hasMorePages = false;
            }
        }

        return response()->json([
            "success" => true,
            "message" => "All products imported successfully"
        ]);
    }

    private function store_or_update_sneaker(array $attributes)
    {
        Product::updateOrCreate(
            ['sku' => $attributes['sku']],
            [
                'brand' => $attributes['brand'],
                'name' => $attributes['name'],
                'color' => $attributes['colorway'],
                'market_price' => $attributes['estimatedMarketValue'],
                'gender' => $attributes['gender'],
                'image' => $attributes['image']['original'],
                'release_date' => Carbon::parse($attributes['releaseDate'])->format('y-m-d'),
                'release_year' => (int)$attributes['releaseYear'],
                'story' => $attributes['story'],
                'price' => (int)$attributes['retailPrice']
            ]
        );
    }
}

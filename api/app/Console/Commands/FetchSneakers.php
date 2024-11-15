<?php

namespace App\Console\Commands;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FetchSneakers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sneakers:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch sneakers from sneakers API, and store them into products database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $current_page = 1;
        $has_more_pages = true;
        $this->info("Script started");

        while ($has_more_pages) {
            $response = Http::timeout(120)->get("http://54.37.12.181:1337/api/sneakers", [
                'pagination[page]' => $current_page,
                'pagination[pageSize]' => 10,
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
                $has_more_pages = false;
            }
        }
        $this->info('Products imported');
    }

    private function store_or_update_sneaker(array $attributes)
    {
        if (!Product::where('name', $attributes['name'])->exists()) {
            $product = Product::updateOrCreate(
                ['sku' => $attributes['sku']],
                [
                    'brand' => $attributes['brand'],
                    'name' => $attributes['name'],
                    'market_price' => (int)$attributes['estimatedMarketValue'] * 100,
                    'gender' => $attributes['gender'],
                    'image' => $attributes['image']['original'],
                    'release_date' => Carbon::parse($attributes['releaseDate'])->format('Y-m-d'),
                    'release_year' => (int)$attributes['releaseYear'],
                    'story' => $attributes['story'],
                    'price' => (int)$attributes['retailPrice']
                ]
            );
            $this->link_size($product);
        }
    }

    private function link_size($product)
    {
        $gender_size = [
            'men' => range(39, 47),
            'women' => range(35, 42),
            'youth' => range(30, 39),
            'child' => range('22', 31),
            'unisex' => range(36, 44),
            'infant' => range(16, 21)
        ];

        foreach ($gender_size[$product->gender] as $size) {
            $variants = $product->variants;
            $variants->sizes->attach($size);
            $variants->save();
        }
    }
}



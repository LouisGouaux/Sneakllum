<?php

namespace App\Console\Commands;

use App\Models\Color;
use App\Models\Product;
use App\Models\Size;
use App\Models\Variant;
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
                    $attributes = $this->clean_data($sneaker['attributes']);
                    if ($attributes != null) {
                        $this->store_or_update_sneaker($attributes);
                    }
                }

                $current_page++;
                $has_more_pages = $pagination['page'] < $pagination['pageCount'];
            } else {
                $has_more_pages = false;
            }
        }
        $this->info('Products imported');
    }

    private function clean_data($attributes)
    {
        if (empty($attributes['image']['original'] ?? null)) {
            return null;
        }
        if ($attributes['image']['original'] == "true") {
            return null;
        }

        if (($attributes['retailPrice'] ?? 0) == 0 && ($attributes['estimatedMarketValue'] ?? 0) == 0) {
            return null;
        }

        if (($attributes['retailPrice'] ?? 0) == 0) {
            $attributes['retailPrice'] = $attributes['estimatedMarketValue'];
        }

        return $attributes;
    }


    private function store_or_update_sneaker(array $attributes)
    {
        $gender = $this->clean_gender($attributes['gender']);
        $colors = array_filter(array_map('trim', explode('/', $attributes['colorway'])));
        if (!Product::where('name', $attributes['name'])->exists()) {
            $product = Product::updateOrCreate(
                ['sku' => $attributes['sku']],
                [
                    'brand' => $attributes['brand'],
                    'name' => $attributes['name'],
                    'market_price' => (int)$attributes['estimatedMarketValue'] * 100,
                    'gender' => $gender,
                    'image' => $attributes['image']['original'],
                    'release_date' => Carbon::parse($attributes['releaseDate'])->format('Y-m-d'),
                    'release_year' => (int)$attributes['releaseYear'],
                    'story' => $attributes['story'],
                    'price' => (int)$attributes['retailPrice'] * 100
                ]
            );
            $this->link_sizes_and_colors($product, $colors);
        }
    }

    private function clean_gender($gender)
    {
        return match ($gender) {
            'preschool', 'toddler' => 'infant',
            default => $gender,
        };
    }

    private function link_sizes_and_colors($product, $colors)
    {
        $gender_size = [
            'men' => range(39, 47),
            'women' => range(35, 42),
            'youth' => range(30, 39),
            'child' => range(22, 31),
            'unisex' => range(36, 44),
            'infant' => range(16, 21),
        ];

        foreach ($gender_size[$product->gender] as $size) {
            $size_id = Size::where('size', $size)->first()->id;
            foreach ($colors as $color) {
                $color = Color::firstOrCreate(['color' => $color]);
                $variant = new Variant();
                $variant->product_id = $product->id;
                $variant->size_id = $size_id;
                $variant->color_id = $color->id;
                $variant->save();
            }
        }
    }
}



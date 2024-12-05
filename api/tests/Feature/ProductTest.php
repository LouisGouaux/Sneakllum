<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductTest extends TestCase
{
    public function test_admin_can_create_a_product(): void
    {
        Storage::fake('test');
        $file = UploadedFile::fake()->image('product.png');

        $response = $this->postJson('api/products', [
            'name' => Str::random(14),
            'brand' => 'Test',
            'gender' => 'infant',
            'story' => 'This is a test',
            'release_date' => '2024-11-12',
            'release_year' => 2024,
            'market_price' => 14000,
            'price' => 12000,
            'image' => $file,
            'variants' => [
                [
                    'size_id' => 1,
                    'color' => 'Red',
                    'stock' => 42
                ],
                [
                    'size_id' => 2,
                    'color' => 'Red',
                    'stock' => 42
                ]
            ]
        ]);

        $response->assertStatus(201);
        $response->dump();
    }

    public function test_user_can_show_product() {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson('api/products/42');

        $response->assertStatus(200);
    }

    public function test_admin_can_show_variants() {
        $user = User::factory()->create([
            'is_admin' => true
        ]);

        $response = $this->actingAs($user)->getJson('api/products/42');

        $response->assertStatus(200);
    }
}

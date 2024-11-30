<?php

namespace Tests\Feature;

use App\Models\Basket;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BasketTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_user_can_create_a_basket(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('api/basket', [
            [
                'product_id' => 1,
                'size_id' => 24,
                'color_id' => 1,
                'quantity' => 1
            ],
            [
                'product_id' => 42,
                'size_id' => 24,
                'color_id' => 1,
                'quantity' => 2
            ]
        ]);

        $basket = Basket::where('user_id', $user->id)->first();
        $first_product = Variant::where('product_id', 1)
            ->where('size_id', 24)
            ->where('color_id', 1)
            ->first();
        $second_product = Variant::where('product_id', 42)
            ->where('size_id', 24)
            ->where('color_id', 1)
            ->first();


        $response->assertStatus(200);
        $this->assertDatabaseHas('basket_variant', [
            'basket_id' => $basket->id,
            'variant_id' => $first_product->id
        ]);
        $this->assertDatabaseHas('basket_variant', [
            'basket_id' => $basket->id,
            'variant_id' => $second_product->id,
            'quantity' => 2
        ]);


        $get_basket = $this->actingAs($user)->getJson('api/basket');

        $get_basket->assertStatus(200);
    }

    public function test_user_can_see_an_empty_basket()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson('api/basket');

        $response->assertStatus(200);

    }

    public function test_user_can_delete_product()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('api/basket', [[
            'product_id' => 1,
            'size_id' => 24,
            'color_id' => 1,
            'quantity' => 1
        ]]);

        $response = $this->actingAs($user)->deleteJson('api/basket', [[
            'product_id' => 1,
            'size_id' => 24,
            'color_id' => 1,
            'quantity' => 0
        ]]);

        $response->assertStatus(200);
    }
}

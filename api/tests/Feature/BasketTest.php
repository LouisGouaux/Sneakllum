<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BasketTest extends TestCase
{
    /**
     * A basic feature test example.
     */

protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }


    public function test_user_can_create_a_basket(): void
    {
        $response = $this->actingAs($this->user)->postJson('api/basket', [
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

        $response->assertStatus(200);

        $get_basket = $this->actingAs($user)->getJson('api/basket');

        $get_basket->assertStatus(200);
    }

    public function test_user_can_see_an_empty_basket() {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson('api/basket');

        $response->assertStatus(200);

    }

    public function test_user_can_delete_product() {

        $response = $this->actingAs($this->user)->deleteJson('api/basket', [[
            'product_id' => 1,
            'size_id' => 24,
            'color_id' => 1,
            'quantity' => 0
        ]]);

        $response->assertStatus(200);
    }
}

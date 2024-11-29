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

        $response->assertStatus(200);
    }
}

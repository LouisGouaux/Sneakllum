<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OrderTest extends TestCase
{
    public function test_user_can_create_an_order()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('api/user/orders', [
            'user_first_name' => $user->first_name,
            'user_last_name' => $user->last_name,
            'user_email' => $user->email,
            'user_phone' => '0600000000',
            'shipping_address' => 'Address'
        ]);

        $response->assertStatus(201);
        $response->dump();
    }

    public function test_guest_can_make_an_order(): void
    {
        $response = $this->postJson('/api/order', [[
            'product_id' => 1,
            'size_id' => 24,
            'color_id' => 1,
            'quantity' => '1'
        ],
            [
                'product_id' => 42,
                'size_id' => 24,
                'color_id' => 1,
                'quantity' => 2
            ]]);

        $response->assertStatus(200);
    }
}

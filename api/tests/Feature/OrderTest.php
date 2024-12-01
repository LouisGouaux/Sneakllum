<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OrderTest extends TestCase
{
    public function test_user_can_make_an_order(): void
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
        $response->dump();
    }
}

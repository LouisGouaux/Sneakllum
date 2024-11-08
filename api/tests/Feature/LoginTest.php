<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function it_logs_in_a_user_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'johndoe@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'johndoe@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'first_name',
                    'last_name',
                    'token',
                ],
                'message',
            ]);
    }

    /** @test */
    public function it_fails_to_log_in_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'johndoe@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'johndoe@example.com',
            'password' => 'wrongpassword',
        ]);

        $response
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid credentials',
            ]);
    }

    /** @test */
    public function it_requires_an_email_for_login()
    {
        $response = $this->postJson('/api/login', [
            'password' => 'password123',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function it_requires_a_password_for_login()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'johndoe@example.com',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function it_requires_password_to_meet_minimum_length()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'johndoe@example.com',
            'password' => 'short',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }
}

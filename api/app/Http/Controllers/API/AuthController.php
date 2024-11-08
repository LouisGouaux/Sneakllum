<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed']
        ]);
        $data['password'] = Hash::make($data['password'])
        $user = User::create($data);
        $token = $user->CreateToken('auth_token')->plainTextToken;
        return response()->json([
            'success' => true,
            'data' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'token' => $token
            ],
            'message' => 'User created successfully'
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:255']
        ]);
        if (Auth::attempt($data)) {
            $user = \auth()->user();
            $token = $user->CreateToken('auth_token')->plainTextToken;
            return response()->json([
                'success' => true,
                'data' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'token' => $token
                ],
                'message' => 'User logged in successfully'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 422);
    }
}

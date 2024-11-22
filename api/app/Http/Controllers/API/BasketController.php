<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BasketController extends Controller
{
    public function store(Request$request) {
        $data = $request->validate([
            '*.product_id' => ['required', 'exists:products,id'],
            '*.size_id' => ['required', 'exists:products,id'],
            '*.color_id' => ['required', 'exists:products,id'],
            '*.quantity' => ['required', 'integer', 'min:1']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'it works'
        ]);
    }
}

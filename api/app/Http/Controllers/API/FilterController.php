<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function brand_index() {
        $brands = Product::distinct()->orderBy('brand', 'asc')->pluck('brand');

        return response()->json([
            'data' => $brands
        ]);
    }
}

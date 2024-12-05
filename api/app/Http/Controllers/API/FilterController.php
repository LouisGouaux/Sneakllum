<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SizeResource;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function brand_index() {
        $brands = Product::distinct()->orderBy('brand', 'asc')->pluck('brand');

        return response()->json([
            'data' => $brands
        ]);
    }

    public function size_index() {
        $sizes = Size::all();

        return SizeResource::collection($sizes);
    }
}

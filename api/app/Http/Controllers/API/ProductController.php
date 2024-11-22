<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::paginate(20);
        return new ProductCollection($products);
    }

    public function new_product()
    {
        $products = Product::orderBy('release_date', 'desc')->paginate(20);
        return new ProductCollection($products);
    }

    public function check_product_stock($id, Request$request)
    {
        $product_variant = Variant::where('product_id', $id)->where('size_id', $request->size_id)->where('color_id', $request->color_id)->first();
        return response()->json([
            'is_available' => $product_variant->stock > 0,
            'stock' => $product_variant->stock,
            'variant_id' => $product_variant->id
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::find($id);
        return response()->json(new ProductResource($product));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}

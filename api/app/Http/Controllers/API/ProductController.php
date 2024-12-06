<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Color;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->validate([
            'sort' => ['string', 'max:5'],
            'brand' => ['string'],
            'gender' => ['string', 'max:10'],
            'size' => ['integer', 'min:15', 'max:49']
        ]);
        if ($request->sort === 'new') {
            $products = $this->new_product();
        } else {
            $query = $this->filter_products($data);
            $products = $query->paginate(20);
        }
        return new ProductCollection($products);
    }

    private function filter_products($data)
    {
        $query = Product::query();
        if (array_key_exists('brand', $data)) {
            $query->where('brand', $data['brand']);
        }
        if (array_key_exists('gender', $data)) {
            $query->where('gender', $data['gender']);
        }
        if (array_key_exists('size', $data)) {
            $size = $data['size'];
            $query->whereHas('sizes', function ($q) use ($size) {
                $q->where('size', $size);
            });
        }
        return $query;
    }

    private function new_product()
    {
        $products = Product::orderBy('release_date', 'desc')->paginate(20);
        return $products;
    }

    public function check_product_stock($id, Request $request)
    {
        $product_variant = Variant::where('product_id', $id)->where('size_id', $request->size_id)->where('color_id', $request->color_id)->first();
        return response()->json([
            'is_available' => $product_variant->stock > 0,
            'stock' => $product_variant->stock,
            'variant_id' => $product_variant->id
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => ['required', 'string', 'min:3']
        ]);

        $query = $request->input('query');
        $products = Product::where('name', 'like', '%' . $query . '%')
            ->orWhere('brand', 'like', '%' . $query . '%')
            ->paginate(20);

        return new ProductCollection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'brand' => ['required', 'string'],
            'name' => ['required', 'string'],
            'gender' => ['required', 'string', 'exists:products,gender'],
            'story' => ['required', 'string'],
            'market_price' => ['required', 'integer', 'min:0'],
            'price' => ['required'],
            'release_date' => ['required', 'date'],
            'release_year' => ['required', 'integer'],
            'image' => ['required', 'file', 'mimes:jpg,png,jpeg'],
            'variants' => ['required'],
            'variants.*size_id' => ['required', 'integer', 'exists:sizes,id'],
            'variants.*color' => ['required', 'string']
        ]);

        $file_path = $request->file('image')->store('images/products', 'public');
        $product = Product::create([
            'sku' => Str::random(12),
            'brand' => $data['brand'],
            'name' => $data['name'],
            'gender' => $data['gender'],
            'release_date' => $data['release_date'],
            'release_year' => $data['release_year'],
            'image' => env('APP_URL') . '/storage/' . $file_path,
            'story' => $data['story'],
            'market_price' => $data['market_price'],
            'price' => $data['price']
        ]);
        $json_variants = json_decode($request->input('variants'), true);

        foreach ($json_variants as $variant) {
            $color = new Color();
            $color->color = $variant['color'];
            $color->save();
            $product_variant = new Variant();
            $product_variant->product_id = $product->id;
            $product_variant->size_id = $variant['size_id'];
            $product_variant->color_id = $color->id;
            $product_variant->stock = $variant['stock'];
            $product_variant->save();

        }
        return response()->json([
            'success' => true,
            'data' => new ProductResource($product),
            'message' => 'product created'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::find($id);
        return response()->json(new ProductResource($product));
    }

    public function recommendation($id)
    {
        $product = Product::find($id);
        $recommendations = Product::query()
            ->where('id', '!=', $product->id)
            ->where(function ($query) use ($product) {
                $query->where('brand', $product->brand)
                    ->orWhere('gender', $product->gender)
                    ->orWhereBetween('price', [$product->price * 0.8, $product->price * 1.2]);
            })
            ->limit(3)
            ->get();

        return new ProductCollection($recommendations);
    }

    /**
     * Update the specified resource in storage.
     */
    public
    function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'brand' => ['required', 'string'],
            'name' => ['required', 'string'],
            'gender' => ['required', 'string', 'exists:products,gender'],
            'story' => ['required', 'string'],
            'market_price' => ['required', 'integer', 'min:0'],
            'price' => ['required'],
            'release_date' => ['required', 'date'],
            'release_year' => ['required', 'integer'],
        ]);

        $product->update($data);

        return response()->json([
            'success' => true,
            'data' => new ProductResource($product),
            'message' => 'product updated successfully'
        ], 200);
    }

    public function update_stock(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt']
        ]);

        $file = $request->file('file');

        $handle_file = fopen($file->getRealPath(), 'r');

        $line_number = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            while (($data = fgetcsv($handle_file, 1000, ',')) !== false) {
                $line_number++;

                if ($line_number == 1 && $this->isHeader($data)) {
                    continue;
                }

                $validator = Validator::make([
                    'variant_id' => $data[0] ?? null,
                    'stock' => $data[1] ?? null,
                ], [
                    'variant_id' => 'required|integer|exists:variants,id',
                    'stock' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    $errors[] = "Error at line $line_number: " . implode(', ', $validator->errors()->all());
                    continue;
                }

                $variant = Variant::find($data[0]);
                $variant->stock = $data[1];
                $variant->save();
            }

            if (!empty($errors)) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'errors' => $errors
                ], 400);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Products imported'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during import: ' . $e->getMessage()
            ], 500);
        }
    }

    private function isHeader($data)
    {
        return isset($data[0]) && strtolower($data[0]) == 'variant_id';
    }

    /**
     * Remove the specified resource from storage.
     */
    public
    function destroy(Product $product)
    {
        //
    }
}

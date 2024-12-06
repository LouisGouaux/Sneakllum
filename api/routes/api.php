<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [\App\Http\Controllers\API\AuthController::class, 'logout']);
    Route::post('basket', [\App\Http\Controllers\API\BasketController::class, 'store']);
    Route::get('basket', [\App\Http\Controllers\API\BasketController::class, 'show']);
    Route::delete('basket', [\App\Http\Controllers\API\BasketController::class, 'delete_products']);
    Route::post('products/stock', [\App\Http\Controllers\API\ProductController::class, 'update_stock']);
    Route::put('products/{id}/images', [\App\Http\Controllers\API\ProductController::class, 'update_image']);
    Route::put('products/{id}', [\App\Http\Controllers\API\ProductController::class, 'update']);
    Route::post('products', [\App\Http\Controllers\API\ProductController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class);
    Route::post('user/orders', [\App\Http\Controllers\API\OrderController::class, 'store_user_checkout']);


});

Route::post('register', [\App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\API\AuthController::class, 'login']);
Route::get('products/search', [\App\Http\Controllers\API\ProductController::class, 'search']);
Route::get('products/{id}', [\App\Http\Controllers\API\ProductController::class, 'show']);
Route::get('products/{id}/recommendations', [\App\Http\Controllers\API\ProductController::class, 'recommendation']);
Route::get('products/{id}/check', [\App\Http\Controllers\API\ProductController::class, 'check_product_stock']);
Route::get('products', [\App\Http\Controllers\API\ProductController::class, 'index']);
Route::get('brands', [\App\Http\Controllers\API\FilterController::class, 'brand_index']);
Route::post('order', [\App\Http\Controllers\API\OrderController::class, 'store_guest_order']);
Route::get('sizes', [\App\Http\Controllers\API\FilterController::class, 'size_index']);
Route::post('orders', [\App\Http\Controllers\API\OrderController::class, 'store_guest_order']);

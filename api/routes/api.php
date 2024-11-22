<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('basket', [\App\Http\Controllers\API\BasketController::class, 'store']);
});

Route::post('register', [\App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\API\AuthController::class, 'login']);
Route::get('products/new', [\App\Http\Controllers\API\ProductController::class, 'new_product']);
Route::get('products/{id}', [\App\Http\Controllers\API\ProductController::class, 'show']);
Route::get('products/{id}/check', [\App\Http\Controllers\API\ProductController::class, 'check_product_stock']);
Route::get('products', [\App\Http\Controllers\API\ProductController::class, 'index']);

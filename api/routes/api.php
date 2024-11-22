<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('register', [\App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\API\AuthController::class, 'login']);
Route::get('products/{id}', [\App\Http\Controllers\API\ProductController::class, 'show']);
Route::get('products', [\App\Http\Controllers\API\ProductController::class, 'index']);

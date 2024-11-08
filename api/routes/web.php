<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get("store_product", [\App\Http\Controllers\Batch\add_product::class, "store_sneaker"]);

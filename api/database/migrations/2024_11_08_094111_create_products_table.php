<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string("brand");
            $table->string("name");
            $table->string("color");
            $table->float('market_price');
            $table->string("gender");
            $table->string("image");
            $table->date("release_date");
            $table->integer("release_year");
            $table->text("story");
            $table->integer("price");
            $table->integer("stock")->default(42);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

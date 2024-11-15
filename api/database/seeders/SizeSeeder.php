<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $size = 16;
        while ($size<49) {
            DB::table('sizes')->insert([
                'size' => $size
            ]);
            $size ++;
        }
    }
}

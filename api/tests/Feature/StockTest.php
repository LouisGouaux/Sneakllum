<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class UpdateStockTest extends TestCase
{
    /** @test */
    public function test_successful_stock_update()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        Storage::fake('local');

        $csv_content = "variant_id,stock\n1,100\n2,200";
        $file_path = 'temp/stock_update.csv';

        // Écrire le contenu dans le fichier CSV
        Storage::disk('local')->put($file_path, $csv_content);

        // Créer l'instance UploadedFile avec le chemin correct
        $file = new UploadedFile(
            Storage::disk('local')->path($file_path),
            'stock_update.csv',
            'text/csv',
            null,
            true
        );

        $response = $this->actingAs($admin)->postJson('/api/products/stock', [
            'file' => $file
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Products imported'
            ]);

        $this->assertDatabaseHas('variants', [
            'id' => 1,
            'stock' => 100
        ]);

        $this->assertDatabaseHas('variants', [
            'id' => 2,
            'stock' => 200
        ]);
    }

    /** @test */
    public function test_stock_update_with_invalid_data()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        Storage::fake('local');

        $csv_content = "variant_id,stock\n1,invalid_stock\n9999,50";
        $file_path = 'temp/stock_update_invalid.csv';

        Storage::disk('local')->put($file_path, $csv_content);

        $file = new UploadedFile(
            Storage::disk('local')->path($file_path),
            'stock_update_invalid.csv',
            'text/csv',
            null,
            true
        );

        $response = $this->actingAs($admin)->postJson('/api/products/stock', [
            'file' => $file
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false
            ]);

        $this->assertDatabaseHas('variants', [
            'id' => 1,
            'stock' => 100
        ]);
    }

    /** @test */
    public function test_stock_update_without_file()
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->postJson('/api/products/stock', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function test_unauthorized_access_to_stock_update()
    {
        $user = User::factory()->create(['is_admin' => false]);

        Storage::fake('local');

        $csv_content = "variant_id,stock\n1,100";
        $file_path = 'temp/stock_update.csv';

        Storage::disk('local')->put($file_path, $csv_content);

        $file = new UploadedFile(
            Storage::disk('local')->path($file_path),
            'stock_update.csv',
            'text/csv',
            null,
            true
        );

        $response = $this->actingAs($user)->postJson('/api/products/stock', [
            'file' => $file
        ]);

        $response->assertStatus(403);
    }
}

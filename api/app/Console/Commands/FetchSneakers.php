<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FetchSneakers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sneakers:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch sneakers from sneakers API, and store them into products database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }
}

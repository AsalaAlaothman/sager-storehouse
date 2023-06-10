<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ArchiveDataCommand extends Command
{
    protected $signature = 'data:archive';

    protected $description = 'Archive system data';

    public function handle()
    {
        $tables = ['products', 'users', 'categories']; // Replace with your system table names

        foreach ($tables as $table) {
            $data = DB::table($table)->select('*')->get()->toArray();

            foreach ($data as $row) {
                DB::table('total_archives')->insert([
                    'table_name' => $table,
                    'data' => json_encode($row),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table($table)->delete();
        }
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded =[];
    protected $table = 'products';

    public function user()
    {
        return $this->belongsTo(User::class)->select('id','name','email');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    public static function store_image($user_id, $file, $key)
    {
        $name = $user_id . "_" . $key . "." . "jpeg";
        $path = $file->storeAs("public/products", $name);
        return $path;
    }
}

<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        $faker = \Faker\Factory::create();

        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'name' => $faker->word,
            'price' => $faker->randomFloat(2, 10, 1000),
            'quantity' => $faker->numberBetween(1, 100),
            'description' => $faker->paragraph,
            'image' => $faker->imageUrl(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            $categories = Category::inRandomOrder()->limit(rand(1, 3))->get();
            $product->categories()->attach($categories);
        });
    }
}


<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ForgetPasswordController;
use App\Http\Controllers\Api\V1\LoginController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\RegisterController;
use App\Http\Controllers\Api\V1\UserController;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => 'api_key'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/register', [RegisterController::class, 'register']);
        Route::post('/login', [LoginController::class, 'login']);
        Route::post('/reset-password', [ForgetPasswordController::class, 'forgot']);
    });
    Route::post('/upload', function (Request $request) {

        $s = session()->put($request->name , Product::store_image(auth()->id(), $request->file('file'),$request->name));
        Log::info( $s );
    });
    Route::group(['middleware' => 'auth:api'], function () {

        Route::get('/index', function(){
              return response()->json([
                'status' => 200,
                'data' => [
                    'users' => User::count(),
                    'product' => Product::count(),
                    'category' => Category::count()
                ],
            ], 200);
        });

        Route::group(['prefix' => 'users'], function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'edit']);
            Route::post('/{id}/update', [UserController::class, 'update']);
            Route::delete('/{id}/delete', [UserController::class, 'destroy']);
        });
        Route::group(['prefix' => 'categories'], function () {
            Route::get('/', [CategoryController::class, 'index']);
            Route::post('/', [CategoryController::class, 'store']);
            Route::get('/{id}', [CategoryController::class, 'edit']);
            Route::post('/{id}/update', [CategoryController::class, 'update']);
            Route::delete('/{id}/delete', [CategoryController::class, 'destroy']);
        });
        Route::group(['prefix' => 'products'], function () {
            Route::get('/', [ProductController::class, 'index']);
            Route::post('/', [ProductController::class, 'store']);
            Route::get('/{id}', [ProductController::class, 'edit']);
            Route::get('/minus/{id}', [ProductController::class, 'minus']);

            Route::post('/{id}/update', [ProductController::class, 'update']);
            Route::delete('/{id}/delete', [ProductController::class, 'destroy']);
        });

    });


});

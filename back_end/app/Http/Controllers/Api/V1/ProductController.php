<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductCategory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Product::orderByDESC('updated_at')->paginate(20);
        return response()->json([
            'status' => 200,
            'data' => ProductResource::collection($data),
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProductRequest $request)
    {
        Log::info($request->all());
        DB::beginTransaction();
        try {
            $user_id = auth()->id();
            //  $img_path=session()->get($request->name);
             $img_path ='/products/_'.$request->name.'.jpeg';

            $data = new Product([
                'name' => $request->name,
                'description' => $request->description,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'image' => $img_path,
                'user_id' => $user_id,
            ]);
            $data->save();
            $pro_cat=[
            ];
            foreach($request->category as $cat){
                $pro_cat []=[
                    'product_id' => $data->id,
                    'category_id' => $cat['id']
                ];
            };
            DB::table('product_categories')->insert($pro_cat);
            DB::commit();
            return response()->json([
                'status' => 201,
                'data' => new ProductResource($data),
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                ['status' => 403],
                ['errors' => $e->getMessage()],
            ], 403);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function minus($id)
    {
        $product = Product::findOrFail($id);
        $product->quantity = $product->quantity-1;
        $product->save();
        return response()->json([
            'status' => 200,
            'data' => [],
        ], 200);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = Product::findOrFail($id);
        return response()->json([
            'status' => 200,
            'data' => new  ProductResource($user),
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $request->validate([
            'name' => "required", "unique:products,name,$id", Rule::unique('products')->where(function ($query) {
                $query->whereNull('deleted_at');
            }),
            'category' => 'required|array|min:1',
            'quantity' =>  "min:1",
            'price' =>  "min:1",
        ]);
        DB::beginTransaction();
        try {
            $user_id = auth()->id();

            if ($request->image) {
                $img_path =  Product::store_image($user_id, $request->image, $request->name);
            }
            $data = Product::findOrFail($id)->update([
                'name' => $request->name,
                'description' => $request->description,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'image' => $img_path,
            ]);
            DB::commit();
            return response()->json([
                'status' => 200,
                'data' => new ProductResource($data),
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::info($e->getMessage());
            return response()->json([
                ['status' => 403],
                ['errors' => $e->getMessage()],
            ], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        DB::beginTransaction();
        try {
            $data = Product::where('id', $id)->first();
            // check if user has product
            
            $data->delete();
            DB::commit();
            return response()->json([
                'status' => 200,
                'massage' => 'User Deleted Successfully',
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::info($e->getMessage());
            return response()->json([
                ['status' => 404],
                ['errors' => $e->getMessage()],
            ], 403);
        }
    }
}

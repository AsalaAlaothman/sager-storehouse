<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Category::paginate(20);
        return response()->json([
            'status' => 200,
            'data' => CategoryResource::collection($data),
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
    public function store(CategoryRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = Category::create([
                'name' =>  $request->name,
            ]);
            DB::commit();
            return response()->json([
                'status' => 201,
                'data' => new CategoryResource($data),
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
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = Category::findOrFail($id);
        return response()->json([
            'status' => 200,
            'data' => new  CategoryResource($user),
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
            'name' => "required","unique:categories,name,$id",Rule::unique('categories')->where(function ($query) {
                $query->whereNull('deleted_at');
            }),
        ]);
        DB::beginTransaction();
        try {
            $data = Category::findOrFail($id);
            $data->name = $request->name;
            $data->save();
            DB::commit();
            return response()->json([
                'status' => 200,
                'data' => new CategoryResource($data),
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        DB::beginTransaction();
        try {
            $data = Category::where('id', $id)->first();
            // check if user has product
            if ($data->products()->count() > 0) {

                return response()->json([
                    'status' => 403,
                    'errors' => 'User has product',
                ], 403);
            }
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

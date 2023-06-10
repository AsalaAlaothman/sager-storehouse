<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::where('id','!=',auth()->id())->paginate(20);
        return response()->json([
            'status' => 200,
            'data' => UserResource::collection($users),
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
    public function store(UserRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' =>  $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
            DB::commit();
            return response()->json([
                'status' => 201,
                'data' => new UserResource($user),
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
        $user = User::findOrFail($id);
        return response()->json([
            'status' => 200,
            'data' => new  UserResource($user),
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
            'name' => 'required',
            'email' => "required","email","unique:users,email,$id",Rule::unique('users')->where(function ($query) {
                $query->whereNull('deleted_at');
            }),
        ]);
        DB::beginTransaction();
        try {
            $user = User::findOrFail($id);
            $user->name = $request->name;
            $user->email = $request->email;
            if ($request->password) {
                $request->validate([
                    'password' => 'required|min:8|regex:/^(?=.*[A-Z])(?=.*[0-9]).+$/|confirmed',
                ], [
                    'password.required' => 'The password field is required.',
                    'password.min' => 'The password must be at least :min characters.',
                    'password.regex' => 'The password must contain at least one uppercase letter and one number.',
                ]);
                $user->password = bcrypt($request->password);
            }
            $user->save();
            DB::commit();
            return response()->json([
                'status' => 200,
                'data' => new UserResource($user),
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
            $user = User::where('id', $id)->first();
            // check if user has product
            if ($user->products()->count() > 0) {

                return response()->json([
                    'status' => 403,
                    'errors' => 'User has product',
                ], 403);
            }
            $user->delete();
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

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' =>  $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
            DB::commit();
            $token = $user->createToken('auth_token');
            return response()->json([
                'status' => 201,
                'token' => $token->accessToken,
                'user' => $user
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                ['status' => 403],
                ['errors' => "Credentials don't match"],
            ], 403);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\SuccessResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required'
        ]);


        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = auth()->user();
            $token = $user->createToken('auth_token');
            return response()->json([
                'status' => 200,
                'token' => $token->accessToken,
                'user' => $user
            ], 200);
        } else {
            return response()->json([
                ['status' => 403],
                ['errors' => "Credentials don't match"],
            ], 403);
        }
    }
}

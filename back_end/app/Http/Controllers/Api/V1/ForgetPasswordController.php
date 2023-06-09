<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\ResetPassword;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Responses\SuccessResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Password;

class ForgetPasswordController extends Controller
{
    public function forgot(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with(['status' => __($status)])
            : back()->withErrors(['email' => __($status)]);
    }


    public function reset_password()
    {
        $token = request()->token;
        return view('auth.reset-password', compact('token'));
    }
    public function password_update(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);
        $user = User::where('email',$request->email)->first();
        $user->update([
            'password' => bcrypt($request->password),
        ]);
        $token = $user->createToken('auth_token');
        return redirect('http://localhost:4200/login');
    }
}

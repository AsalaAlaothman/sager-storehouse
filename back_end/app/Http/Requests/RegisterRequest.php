<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'email'=>'required|email|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[A-Z])(?=.*[0-9]).+$/|confirmed',
        ];
    }
    public function messages()
    {
        return [
            'password.required' => 'The password field is required.',
            'password.min' => 'The password must be at least :min characters.',
            'password.regex' => 'The password must contain at least one uppercase letter and one number.',
        ];
    }
}

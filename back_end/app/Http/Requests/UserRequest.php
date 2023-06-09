<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class UserRequest extends FormRequest
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
            'email' => ['required', 'email', Rule::unique('users')->where(function ($query) {
                $query->whereNull('deleted_at');
            }),],

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

<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'dob'         => 'required|date',
            'email'       => 'required|email|unique:user,email',
            'password'    => 'required|min:6',
            'edu_info_qn' => 'required|string',
        ]);

        if ($v->fails()) {
            return response()->json(['success' => false, 'errors' => $v->errors()], 422);
        }

        $user = User::create([
            'name'        => $request->name,
            'dob'         => $request->dob,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'edu_info_qn' => $request->edu_info_qn,
        ]);

        return response()->json(['success' => true, 'message' => 'Account created!'], 201);
    }

    public function login(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($v->fails()) {
            return response()->json(['success' => false, 'errors' => $v->errors()], 422);
        }

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'userID'      => $user->userID,
                'name'        => $user->name,
                'email'       => $user->email,
                'dob'         => $user->dob,
                'edu_info_qn' => $user->edu_info_qn,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        return response()->json(['success' => true, 'user' => $request->user()]);
    }
}
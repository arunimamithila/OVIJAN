<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    // ─────────────────────────────────────────────
    // GET /api/applications  (auth:sanctum)
    // Returns all applications for the logged-in user
    // ─────────────────────────────────────────────
    public function index(Request $request)
    {
        $uid = $request->user()->userID;

        $apps = DB::table('user_applications as ua')
            ->join('universities as u', 'ua.universitiesid', '=', 'u.id')
            ->join('countries as c', 'u.country_id', '=', 'c.id')
            ->where('ua.useruserID', $uid)
            ->select(
                'ua.id',
                'ua.program',
                'ua.program_level',
                'ua.program_name',
                'ua.result',
                'ua.passing_year',
                'ua.eng_test_type',
                'ua.eng_test_score',
                'ua.nationality',
                'ua.current_address',
                'ua.passport_number',
                'u.name as university_name',
                'u.short_name',
                'u.location as university_location',
                'u.image_url as university_image',
                'u.rank as university_rank',
                'c.name as country_name',
                'c.flag'
            )
            ->orderByDesc('ua.id')
            ->get();

        return response()->json(['success' => true, 'data' => $apps]);
    }

    // ─────────────────────────────────────────────
    // POST /api/applications  (auth:sanctum)
    // ─────────────────────────────────────────────
    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'universitiesid'     => 'required|integer|exists:universities,id',
            'admission_seasonid' => 'required|integer|exists:admission_season,id',
            'name'               => 'required|string|max:100',
            'dob'                => 'required|date',
            'passport_number'    => 'required|string|max:100',
            'email'              => 'required|email|max:100',
            'program'            => 'nullable|string|max:255',
            'program_level'      => 'nullable|string|max:100',
            'program_name'       => 'nullable|string|max:100',
            'result'             => 'nullable|string|max:100',
            'passing_year'       => 'nullable|string|max:100',
            'transcript'         => 'nullable|string',
            'eng_test_type'      => 'nullable|string|max:100',
            'eng_test_score'     => 'nullable|numeric',
            'standard_test_type' => 'nullable|string|max:100',
            'standard_test_score'=> 'nullable|string|max:50',
            'cv'                 => 'required|string',
            'sop'                => 'required|string',
            'current_address'    => 'nullable|string|max:100',
            'nationality'        => 'nullable|string|max:100',
        ]);

        if ($v->fails()) {
            return response()->json(['success' => false, 'errors' => $v->errors()], 422);
        }

        $id = DB::table('user_applications')->insertGetId(array_merge(
            $v->validated(),
            ['useruserID' => $request->user()->userID]
        ));

        return response()->json(['success' => true, 'message' => 'Application submitted.', 'id' => $id], 201);
    }

    // ─────────────────────────────────────────────
    // GET /api/applications/{id}  (auth:sanctum)
    // ─────────────────────────────────────────────
    public function show(Request $request, $id)
    {
        $uid = $request->user()->userID;

        $app = DB::table('user_applications as ua')
            ->join('universities as u', 'ua.universitiesid', '=', 'u.id')
            ->join('countries as c', 'u.country_id', '=', 'c.id')
            ->where('ua.useruserID', $uid)
            ->where('ua.id', $id)
            ->select('ua.*', 'u.name as university_name', 'u.short_name', 'c.name as country_name', 'c.flag')
            ->first();

        if (!$app) {
            return response()->json(['success' => false, 'message' => 'Application not found.'], 404);
        }

        return response()->json(['success' => true, 'data' => $app]);
    }

    // ─────────────────────────────────────────────
    // GET /api/applications/stats  (auth:sanctum)
    // ─────────────────────────────────────────────
    public function getStats(Request $request)
    {
        $uid = $request->user()->userID;

        return response()->json([
            'success' => true,
            'data' => [
                'total'    => DB::table('user_applications')->where('useruserID', $uid)->count(),
                'by_level' => DB::table('user_applications')
                    ->where('useruserID', $uid)
                    ->select('program_level', DB::raw('count(*) as count'))
                    ->groupBy('program_level')
                    ->get(),
            ]
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/applications/user/{userId}
    // (kept for backward compat — prefer /api/applications on auth user)
    // ─────────────────────────────────────────────
    public function getUserApplications(Request $request, $userId)
    {
        $apps = DB::table('user_applications as ua')
            ->join('universities as u', 'ua.universitiesid', '=', 'u.id')
            ->join('countries as c', 'u.country_id', '=', 'c.id')
            ->where('ua.useruserID', $userId)
            ->select('ua.*', 'u.name as university_name', 'c.name as country_name', 'c.flag')
            ->get();

        return response()->json(['success' => true, 'data' => $apps]);
    }
}

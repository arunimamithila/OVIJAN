<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class ProfileController extends Controller
{
    // ─────────────────────────────────────────────
    // GET /api/profile  (auth:sanctum)
    // Returns the full profile for the logged-in user
    // ─────────────────────────────────────────────
    public function show(Request $request)
    {
        $user = $request->user();
        $uid  = $user->userID;

        // Core user row
        $profile = [
            'userID'       => $user->userID,
            'name'         => $user->name,
            'dob'          => $user->dob,
            'email'        => $user->email,
            'edu_info_qn'  => $user->edu_info_qn,
        ];

        // SSC / O-Level results
        $profile['o_level'] = DB::table('user_o_level as uo')
            ->join('o_level as o', 'uo.o_levelid', '=', 'o.id')
            ->where('uo.useruserID', $uid)
            ->select('o.id', 'o.sub_name', 'uo.grade', 'uo.ingpa')
            ->get();

        // HSC / A-Level results
        $profile['a_level'] = DB::table('user_a_level as ua')
            ->join('a_level as a', 'ua.a_levelid', '=', 'a.id')
            ->where('ua.useruserID', $uid)
            ->select('a.id', 'a.sub_name', 'ua.grade', 'ua.ingpa')
            ->get();

        // Bangla SSC/HSC (if used)
        $profile['bangla'] = DB::table('bangla')
            ->where('useruserID', $uid)
            ->first();

        // Exam scores (IELTS, GRE, etc.)
        $profile['exams'] = DB::table('user_exam as ue')
            ->join('exam as e', 'ue.examid', '=', 'e.id')
            ->where('ue.useruserID', $uid)
            ->select('e.id', 'e.exam_name', 'ue.exam_scores', 'ue.docment')
            ->get();

        // Skills
        $profile['skills'] = DB::table('user_skills as us')
            ->join('skills as s', 'us.skillsid', '=', 's.id')
            ->where('us.useruserID', $uid)
            ->select('s.id', 's.name', 'us.link_of_project', 'us.exprience')
            ->get();

        // Extracurricular
        $profile['extracurricular'] = DB::table('user_extracriculuer as ue')
            ->join('extracriculuer as e', 'ue.extracriculuerid', '=', 'e.id')
            ->where('ue.useruserID', $uid)
            ->select('e.id', 'e.name', 'ue.detail')
            ->get();

        // Research papers
        $profile['research'] = DB::table('user_recherspaper as ur')
            ->join('recherspaper as r', 'ur.recherspaperid', '=', 'r.id')
            ->where('ur.useruserID', $uid)
            ->select('r.id', 'r.research_field', 'r.paper_type', 'r.publication_status', 'r.journal_or_conference_name', 'ur.paper_title', 'ur.paper_link')
            ->get();

        // Applications
        $profile['applications'] = DB::table('user_applications as ua')
            ->join('universities as u', 'ua.universitiesid', '=', 'u.id')
            ->join('countries as c', 'u.country_id', '=', 'c.id')
            ->where('ua.useruserID', $uid)
            ->select(
                'ua.id', 'ua.program', 'ua.program_level', 'ua.program_name',
                'ua.result', 'ua.eng_test_type', 'ua.eng_test_score',
                'ua.passing_year', 'ua.passport_number',
                'u.name as university_name', 'u.short_name',
                'c.name as country_name', 'c.flag'
            )
            ->get();

        return response()->json(['success' => true, 'data' => $profile]);
    }

    // ─────────────────────────────────────────────
    // PUT /api/profile  (auth:sanctum)
    // Updates core user fields
    // ─────────────────────────────────────────────
    public function update(Request $request)
    {
        $user = $request->user();

        $v = Validator::make($request->all(), [
            'name'        => 'sometimes|string|max:255',
            'dob'         => 'sometimes|date',
            'edu_info_qn' => 'sometimes|string',
        ]);

        if ($v->fails()) {
            return response()->json(['success' => false, 'errors' => $v->errors()], 422);
        }

        if ($request->has('name'))        $user->name        = $request->name;
        if ($request->has('dob'))         $user->dob         = $request->dob;
        if ($request->has('edu_info_qn')) $user->edu_info_qn = $request->edu_info_qn;

        $user->save();

        return response()->json(['success' => true, 'message' => 'Profile updated.', 'data' => [
            'userID'      => $user->userID,
            'name'        => $user->name,
            'dob'         => $user->dob,
            'email'       => $user->email,
            'edu_info_qn' => $user->edu_info_qn,
        ]]);
    }

    // ─────────────────────────────────────────────
    // PUT /api/profile/password  (auth:sanctum)
    // ─────────────────────────────────────────────
    public function updatePassword(Request $request)
    {
        $v = Validator::make($request->all(), [
            'current_password' => 'required',
            'password'         => 'required|min:6|confirmed',
        ]);
        if ($v->fails()) return response()->json(['success' => false, 'errors' => $v->errors()], 422);

        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 403);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['success' => true, 'message' => 'Password updated.']);
    }

    // ─────────────────────────────────────────────
    // POST /api/profile/exams  (auth:sanctum)
    // Upsert an exam score row
    // Body: { examid, exam_scores, docment? }
    // ─────────────────────────────────────────────
    public function upsertExam(Request $request)
    {
        $v = Validator::make($request->all(), [
            'examid'      => 'required|integer|exists:exam,id',
            'exam_scores' => 'required|string|max:255',
            'docment'     => 'nullable|string',
        ]);
        if ($v->fails()) return response()->json(['success' => false, 'errors' => $v->errors()], 422);

        $uid = $request->user()->userID;

        DB::table('user_exam')->updateOrInsert(
            ['useruserID' => $uid, 'examid' => $request->examid],
            ['exam_scores' => $request->exam_scores, 'docment' => $request->docment]
        );

        return response()->json(['success' => true, 'message' => 'Exam score saved.']);
    }

    // DELETE /api/profile/exams/{examid}
    public function deleteExam(Request $request, $examid)
    {
        DB::table('user_exam')
            ->where('useruserID', $request->user()->userID)
            ->where('examid', $examid)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Exam removed.']);
    }

    // ─────────────────────────────────────────────
    // POST /api/profile/skills  (auth:sanctum)
    // Body: { skillsid, link_of_project?, exprience? }
    // ─────────────────────────────────────────────
    public function upsertSkill(Request $request)
    {
        $v = Validator::make($request->all(), [
            'skillsid'        => 'required|integer|exists:skills,id',
            'link_of_project' => 'nullable|string|max:255',
            'exprience'       => 'nullable|integer',
        ]);
        if ($v->fails()) return response()->json(['success' => false, 'errors' => $v->errors()], 422);

        $uid = $request->user()->userID;

        DB::table('user_skills')->updateOrInsert(
            ['useruserID' => $uid, 'skillsid' => $request->skillsid],
            [
                'link_of_project' => $request->link_of_project,
                'exprience'       => $request->exprience,
            ]
        );

        return response()->json(['success' => true, 'message' => 'Skill saved.']);
    }

    // DELETE /api/profile/skills/{skillsid}
    public function deleteSkill(Request $request, $skillsid)
    {
        DB::table('user_skills')
            ->where('useruserID', $request->user()->userID)
            ->where('skillsid', $skillsid)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Skill removed.']);
    }

    // ─────────────────────────────────────────────
    // POST /api/profile/skills/sync  (auth:sanctum)
    // Replace ALL skills for the user in one call
    // Body: { skills: ["JavaScript", "Python", ...] }
    // Creates skill rows in `skills` table if missing,
    // then replaces user_skills entries.
    // ─────────────────────────────────────────────
    public function syncSkills(Request $request)
    {
        $v = Validator::make($request->all(), [
            'skills'   => 'required|array',
            'skills.*' => 'string|max:100',
        ]);
        if ($v->fails()) return response()->json(['success' => false, 'errors' => $v->errors()], 422);

        $uid = $request->user()->userID;

        // Delete existing
        DB::table('user_skills')->where('useruserID', $uid)->delete();

        // Upsert each skill name → get/create skill row → insert user_skills
        foreach ($request->skills as $skillName) {
            $trimmed = trim($skillName);
            if (!$trimmed) continue;

            // Get existing or create
            $existing = DB::table('skills')->where('name', $trimmed)->first();
            if ($existing) {
                $skillsid = $existing->id;
            } else {
                $skillsid = DB::table('skills')->insertGetId(['name' => $trimmed]);
            }

            DB::table('user_skills')->insert([
                'useruserID' => $uid,
                'skillsid'   => $skillsid,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Skills synced.']);
    }

    // ─────────────────────────────────────────────
    // GET /api/profile/stats  (auth:sanctum)
    // Returns dashboard stat numbers
    // ─────────────────────────────────────────────
    public function stats(Request $request)
    {
        $uid = $request->user()->userID;

        $totalDocs     = 16; // fixed total expected documents
        $uploadedDocs  = DB::table('user_applications')->where('useruserID', $uid)->count();
        $skillCount    = DB::table('user_skills')->where('useruserID', $uid)->count();
        $examCount     = DB::table('user_exam')->where('useruserID', $uid)->count();
        $appCount      = DB::table('user_applications')->where('useruserID', $uid)->count();
        $extraCount    = DB::table('user_extracriculuer')->where('useruserID', $uid)->count();
        $researchCount = DB::table('user_recherspaper')->where('useruserID', $uid)->count();

        // Simple profile completion percentage
        $user          = $request->user();
        $fields        = ['name', 'dob', 'email', 'edu_info_qn'];
        $filled        = collect($fields)->filter(fn($f) => !empty($user->$f))->count();
        $baseScore     = ($filled / count($fields)) * 40;           // 40 pts for core fields
        $skillScore    = min($skillCount * 5, 20);                   // up to 20 pts
        $examScore     = min($examCount * 10, 20);                   // up to 20 pts
        $extraScore    = min($extraCount * 5, 10);                   // up to 10 pts
        $researchScore = min($researchCount * 5, 10);                // up to 10 pts
        $completion    = (int) min(100, $baseScore + $skillScore + $examScore + $extraScore + $researchScore);

        return response()->json([
            'success' => true,
            'data'    => [
                'profile_completion' => $completion,
                'application_count'  => $appCount,
                'skill_count'        => $skillCount,
                'exam_count'         => $examCount,
                'research_count'     => $researchCount,
                'extra_count'        => $extraCount,
            ],
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/reference/skills     — list all skills (for picker)
    // GET /api/reference/exams      — list all exams
    // GET /api/reference/extras     — list all extracurriculars
    // ─────────────────────────────────────────────
    public function referenceSkills()  { return response()->json(DB::table('skills')->orderBy('name')->get()); }
    public function referenceExams()   { return response()->json(DB::table('exam')->orderBy('id')->get()); }
    public function referenceExtras()  { return response()->json(DB::table('extracriculuer')->orderBy('name')->get()); }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\University;

class UniversityController extends Controller
{
    public function index(Request $request)
    {
        $query = University::query();
        
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        $universities = $query->get();
        
        // Transform data for frontend compatibility
        $universities->transform(function($uni) {
            $uni->ranking = $uni->rank;
            $uni->established = $uni->estavlished;
            return $uni;
        });
        
        return response()->json($universities);
    }
    
    public function show($id)
    {
        $university = University::find($id);
        
        if (!$university) {
            return response()->json(['message' => 'University not found'], 404);
        }
        
        $university->ranking = $university->rank;
        $university->established = $university->estavlished;
        
        return response()->json($university);
    }
    
    public function getByCountry($countryId)
    {
        $universities = University::where('country_id', $countryId)->get();
        
        $universities->transform(function($uni) {
            $uni->ranking = $uni->rank;
            $uni->established = $uni->estavlished;
            return $uni;
        });
        
        return response()->json($universities);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\University;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Get all countries with their universities
     */
    public function index()
    {
        $countries = Country::with('universities')->get();
        return response()->json($countries);
    }

    /**
     * Get single country by name with universities
     */
    public function show($name)
    {
        $country = Country::where('name', 'LIKE', "%{$name}%")
                          ->with('universities')
                          ->first();

        if (!$country) {
            return response()->json([
                'success' => false,
                'message' => 'Country not found'
            ], 404);
        }

        return response()->json($country);
    }

    /**
     * Get all universities (optionally filtered by country_id)
     */
    public function allUniversities(Request $request)
    {
        $query = University::with('country');
        
        // Filter by country_id if provided
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        // Filter by university type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        // Filter by maximum ranking
        if ($request->has('max_ranking')) {
            $query->where('ranking', '<=', $request->max_ranking);
        }
        
        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }
        
        // Sort options
        $sortBy = $request->get('sort_by', 'ranking');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if ($sortBy === 'name') {
            $query->orderBy('name', $sortOrder);
        } elseif ($sortBy === 'established') {
            $query->orderBy('established', $sortOrder);
        } else {
            $query->orderBy('ranking', $sortOrder);
        }
        
        $universities = $query->get();
        
        return response()->json([
            'success' => true,
            'count' => $universities->count(),
            'data' => $universities
        ]);
    }

    /**
     * Get single university by ID
     */
    public function getUniversity($id)
    {
        $university = University::with('country')->find($id);
        
        if (!$university) {
            return response()->json([
                'success' => false,
                'message' => 'University not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $university
        ]);
    }

    /**
     * Get universities by country ID
     */
    public function getUniversitiesByCountry($countryId)
    {
        $country = Country::find($countryId);
        
        if (!$country) {
            return response()->json([
                'success' => false,
                'message' => 'Country not found'
            ], 404);
        }
        
        $universities = University::where('country_id', $countryId)
                                  ->orderBy('ranking', 'asc')
                                  ->get();
        
        return response()->json([
            'success' => true,
            'country' => $country->name,
            'count' => $universities->count(),
            'data' => $universities
        ]);
    }

    /**
     * Get university statistics
     */
    public function getUniversityStats()
    {
        $stats = [
            'total_universities' => University::count(),
            'total_countries' => Country::count(),
            'top_ranked' => University::orderBy('ranking', 'asc')->limit(10)->get(),
            'by_type' => [
                'public' => University::where('type', 'Public')->count(),
                'private' => University::where('type', 'Private')->count(),
            ],
            'avg_tuition_by_type' => [
                'public' => University::where('type', 'Public')->avg('tuition'),
                'private' => University::where('type', 'Private')->avg('tuition'),
            ]
        ];
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}